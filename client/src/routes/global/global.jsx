import { h } from 'preact';
import { useQuery } from '@apollo/client';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  LineChart,
  Line,
} from 'recharts';

import Loading from '../../components/loading';
import ErrorComponent from '../../components/error';
import format from '../../util/format';
import items from '../../util/items';
import dragons from '../../util/dragons';
import { HTTP_ERROR } from '../../errors';
import GLOBAL_QUERY from '../../queries/global';
import classes from './global.module.scss';

export default function Global() {
  const { data, loading, error } = useQuery(GLOBAL_QUERY);

  if (loading) return <Loading />;

  if (error) return <ErrorComponent error={HTTP_ERROR} />;

  return (
    <div className={classes.container}>
      <div className={classes.graphContainer}>
        <h1 className={classes.graphTitle}>Dragon Prices</h1>
        <h1 className={classes.graphTitle}>
          <BarChart
            width={500}
            height={250}
            margin={{
              top: 20,
              right: 20,
              bottom: 10,
              left: 10,
            }}
            data={data.prices}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="item" tick={false} />
            <YAxis tickFormatter={format} />
            <Tooltip
              content={({ payload }) => (
                <div className={classes.tooltipContainer}>
                  {payload.map(
                    ({
                      payload: {
                        item,
                        iqr: { min, max, avg },
                      },
                    }) => (
                      <div>
                        <h1 className={classes.tooltipTitle}>
                          {items(item).name}
                        </h1>
                        <p className={classes.tooltipSub}>
                          {`${avg} coins (${min} ~ ${max})`}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}
            />
            <Bar dataKey={({ iqr }) => [iqr.min, iqr.max]}>
              {data.prices.map(({ item }) => (
                <Cell fill={items(item).color} />
              ))}
            </Bar>
          </BarChart>
        </h1>
      </div>
      <div className={classes.graphContainer}>
        <h1 className={classes.graphTitle}>Dragon Types</h1>
        <BarChart
          width={500}
          height={250}
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          data={data.dragonChances}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dragonType" tick={false} />
          <YAxis tickFormatter={(n) => format(n * 100)} unit="%" />
          <Tooltip
            content={({ payload }) => (
              <div className={classes.tooltipContainer}>
                {payload.map(({ payload: { dragonType, chance } }) => (
                  <div>
                    <h1 className={classes.tooltipTitle}>
                      {dragons(dragonType).name}
                    </h1>
                    <p className={classes.tooltipSub}>
                      {`${format(chance * 100)}%`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          />
          <Bar dataKey="chance">
            {data.dragonChances.map(({ dragonType }) => (
              <Cell fill={dragons(dragonType).color} />
            ))}
          </Bar>
        </BarChart>
      </div>
      <div className={classes.graphContainer}>
        <h1 className={classes.graphTitle}>Dragon Nets</h1>
        <LineChart
          width={500}
          height={250}
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          data={data.profits}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: '0.75rem' }}
            tickFormatter={(date) => format(new Date(date))}
            interval={0}
          />
          <YAxis
            tickFormatter={(n) => format(n)}
            interval="preserveStartEnd"
            scale="linear"
          />
          <Tooltip
            content={({ payload }) => (
              <div className={classes.tooltipContainer}>
                {payload.map(({ payload: { date, profit } }) => (
                  <div>
                    <h1 className={classes.tooltipTitle}>
                      {format(new Date(date))}
                    </h1>
                    <p className={classes.tooltipSub}>{format(profit)}</p>
                  </div>
                ))}
              </div>
            )}
          />
          <Line dataKey="profit" strokeWidth={3} stroke="#324a54" />
        </LineChart>
      </div>
    </div>
  );
}
