import { QueryOrder, QBFilterQuery, QueryOrderMap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/knex';
import { Event } from 'src/entities/Event';

export class EventsRepository extends EntityRepository<Event> {
  public findByDistance(
    lat = 1,
    lng = 1,
    idLogged = 1,
    where: QBFilterQuery<Event> = null,
    orderBy: QueryOrderMap<Event> = { distance: QueryOrder.ASC },
    joins: Map<string, any> = null
  ): Promise<Event[]> {
    let qb = this.em
      .createQueryBuilder(Event, 'e')
      .select([
        'e.*',
        `haversine(e.lat, e.lng, ${lat}, ${lng}) AS distance`,
        `exists(SELECT 1 FROM user_attend_event uae WHERE uae.user = ${idLogged} AND uae.event = e.id) AS attend`,
      ])
      .joinAndSelect('e.creator', 'u');

    if (where) {
      qb = qb.where(where);
    }

    if (joins) {
      console.log(joins);
      for (const join of joins.keys()) {
        qb = qb.join('e.' + join, join, joins.get(join));
      }
    }

    if (orderBy) {
      qb = qb.orderBy(orderBy);
    }

    return qb.getResult();
  }

  public findById(
    idEvent: number,
    lat = 0,
    lng = 0,
    idLogged = 1
  ): Promise<Event> {
    return this.em
      .createQueryBuilder(Event, 'e')
      .select([
        'e.*',
        `haversine(e.lat, e.lng, ${lat}, ${lng}) AS distance`,
        `exists(SELECT 1 FROM user_attend_event uae WHERE uae.user = ${idLogged} AND uae.event = e.id) AS attend`,
      ])
      .joinAndSelect('e.creator', 'u')
      .where({ id: idEvent })
      .getSingleResult();
  }
}
