import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Watchlist } from '../entities/Watchlist';
import { isAuth } from '../middleware/isAuth';

@InputType()
class WatchlistInput {
  @Field()
  name: string;

  @Field()
  item: string;
}

@ObjectType()
class WatchlistResponse {
  @Field(() => Watchlist, { nullable: true })
  watchlist?: Watchlist;
}

@Resolver(Watchlist)
export class WatchlistResolver {
  @Query(() => WatchlistResponse)
  @UseMiddleware(isAuth)
  async getWatchlist(
    @Arg('name') name: string,
    @Ctx() { req }: MyContext
  ): Promise<WatchlistResponse> {
    const watchlist = await Watchlist.findOne({
      where: { creatorId: req.session.userId, name },
    });
    return { watchlist };
  }

  @Mutation(() => Watchlist, { nullable: true })
  @UseMiddleware(isAuth)
  async addToWatchlist(
    @Arg('input') input: WatchlistInput,
    @Ctx() { req }: MyContext
  ): Promise<Watchlist | null> {
    const watchlist = await Watchlist.findOne({
      where: { creatorId: req.session.userId, name: input.name },
    });

    if (watchlist) {
      const result = await getConnection()
        .createQueryBuilder()
        .update(Watchlist)
        .set({ items: [...watchlist.items, input.item] })
        .where('id = :id and "creatorId" = :creatorId', {
          id: watchlist.id,
          creatorId: req.session.userId,
        })
        .returning('*')
        .execute();
      return result.raw[0];
    }
    return null;
  }

  @Mutation(() => Watchlist)
  @UseMiddleware(isAuth)
  async createWatchlist(
    @Arg('name') name: string,
    @Arg('items', () => [String]) items: string[],
    @Ctx() { req }: MyContext
  ): Promise<Watchlist | null> {
    return Watchlist.create({
      name,
      items,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteWatchlist(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    await Watchlist.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
