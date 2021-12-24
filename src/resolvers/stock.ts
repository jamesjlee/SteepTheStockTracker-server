import { addDays, daysBetween } from '../entities/utils/dateUtil';
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { Stock } from '../entities/Stock';
import { FieldError } from './FieldError';
const moment = require('moment');
const alpha = require('alphavantage')({ key: process.env.ALPHA_VANTAGE_KEY });

@ObjectType()
class StocksResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Stock], { nullable: true })
  stocks?: Stock[];
}

@Resolver(Stock)
export class StockResolver {
  @Query(() => StocksResponse)
  async stocks(
    @Arg('symbol') symbol: string,
    @Arg('from', () => String) from: Date,
    @Arg('to', () => String) to: Date
  ): Promise<StocksResponse> {
    if (!from) {
      return {
        errors: [
          {
            field: 'from',
            message: 'must be a valid from date',
          },
        ],
      };
    }

    if (!to) {
      return {
        errors: [
          {
            field: 'to',
            message: 'must be a valid to date',
          },
        ],
      };
    }

    const stocks = await Stock.find({
      where: { symbol, from: from.toString(), to: to.toString() },
    });
    if (stocks.length < 1) {
      // return googleFinance.historical(
      //   {
      //     symbol,
      //     from: from.toString(),
      //     to: to.toString(),
      //     period: 'd',
      //   },
      //   function (err: string, quotes: Stock[]) {
      //     if (err) {
      //       return {
      //         errors: [
      //           {
      //             field: null,
      //             message: 'error fetching stocks',
      //           },
      //         ],
      //       };
      //     }
      //     return { stocks: quotes };
      //   }
      // );
    }
    // return { stocks: [] };

    return { stocks: [], errors: [] };
  }

  @Mutation(() => StocksResponse)
  async saveStocks(
    @Arg('symbol') symbol: string,
    @Arg('from', () => String) from: Date,
    @Arg('to', () => String) to: Date
  ): Promise<StocksResponse> {
    if (!from) {
      return {
        errors: [
          {
            field: 'from',
            message: 'must be a valid from date',
          },
        ],
      };
    }

    if (!to) {
      return {
        errors: [
          {
            field: 'to',
            message: 'must be a valid to date',
          },
        ],
      };
    }

    const days = daysBetween(moment(from.toString()), moment(to.toString()));

    // check db if it already exists
    let checkObj = {
      notFound: false,
      date: new Date(0),
    };

    for (let i = 0; i <= days; i++) {
      let date = addDays(from, i);
      let recordDate = moment(date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
      const data = await Stock.find({
        where: {
          symbol,
          recordDate,
        },
      });
      console.log(recordDate);
      if (data?.length < 1) {
        checkObj = {
          notFound: true,
          date: moment(date),
        };
        break;
      }
    }

    // if it doesn't already exist in db, then insert
    if (checkObj.notFound) {
      console.log('not found!!!');
      const result: Stock[] = [];
      const daysBetweenNotFound = daysBetween(
        moment(checkObj.date),
        moment(to.toString())
      );
      try {
        const dailyData = await alpha.data.daily(symbol, 'compact');
        for (let i = 0; i <= daysBetweenNotFound; i++) {
          let date = addDays(checkObj.date, i);
          const data =
            dailyData['Time Series (Daily)'][`${date.format('YYYY-MM-DD')}`];
          if (data) {
            const stock = Stock.create({
              symbol,
              recordDate: moment.utc(date),
              open: parseFloat(data['1. open']),
              high: parseFloat(data['2. high']),
              low: parseFloat(data['3. low']),
              close: parseFloat(data['4. close']),
              volume: parseFloat(data['5. volume']),
            });
            result.unshift(stock);
            stock.save();
          }
        }
        return {
          stocks: result,
          errors: [],
        };
      } catch (err) {
        if (err) {
          console.log(err);
          return {
            errors: [
              {
                field: '',
                message: 'unable to fetch daily stock data from alphavantage',
              },
            ],
          };
        }
      }
    }
    return { stocks: [], errors: [] };
  }
}
