import { h } from 'preact';
import {
  Cell,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';

import Loading from '../../components/loading';
import ErrorComponent from '../../components/error';
import Row from '../../components/row';
import findDragon from '../../util/dragons';
import format from '../../util/format';
import count from '../../util/count';
import useUser from '../../hooks/useUser';
import classes from './user.module';

export default function User({ username }) {
  const {
    displayName,
    dragons,
    dragonOverviews,
    currentOverview,
    loadMoreItems,
    loading,
    error,
  } = useUser({ username });

  if (loading) return <Loading />;
  if (error) return <ErrorComponent />;

  const { dragonTypes = [], dragonCount = 0 } = currentOverview;
  const pieData = count(dragonTypes);

  return (
    <div className={classes.containerFlex}>
      <div className={classes.sidebarContainer}>
        <h1 className={classes.username}>
          {`Loot for ${displayName || username}`}
        </h1>
        <div className={classes.graphContainer}>
          <h1 className={classes.graphTitle}>Dragon Types</h1>
          <ResponsiveContainer width="99%" aspect={2} maxHeight={275}>
            <BarChart
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
              data={pieData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dragonType" tick={false} />
              <YAxis tickFormatter={(n) => n} />
              <Tooltip
                content={({ payload }) => (
                  <div className={classes.tooltipContainer}>
                    {payload.map(({ payload: { dragonType, count } }) => (
                      <div>
                        <h1 className={classes.tooltipTitle}>
                          {findDragon(dragonType).name}
                        </h1>
                        <p className={classes.tooltipSub}>{count}</p>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Bar dataKey="count">
                {pieData.map(({ dragonType }) => (
                  <Cell fill={findDragon(dragonType).color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className={classes.graphContainer}>
          <h1 className={classes.graphTitle}>Dragon Nets</h1>
          <ResponsiveContainer width="100%" aspect={2} maxHeight={275}>
            <LineChart
              margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
              data={dragonOverviews.slice(-7)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: '0.75rem' }}
                tickFormatter={(date) => format(new Date(date))}
                interval={0}
              />
              <YAxis
                tickFormatter={(n) => format(n)}
                interval="preserveStartEnd"
              />
              <Tooltip
                content={({ payload }) => (
                  <div className={classes.tooltipContainer}>
                    {payload.map(({ payload: { day, gross } }) => (
                      <div>
                        <h1 className={classes.tooltipTitle}>
                          {format(new Date(day))}
                        </h1>
                        <p className={classes.tooltipSub}>{format(gross)}</p>
                      </div>
                    ))}
                  </div>
                )}
              />
              <Line dataKey="gross" strokeWidth={3} stroke="#324a54" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={classes.tableContainer}>
        <InfiniteLoader
          isItemLoaded={({ index }) => index < dragons.length}
          loadMoreItems={loadMoreItems}
          itemCount={dragonCount}
        >
          {({ onItemsRendered, ref }) => (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={height}
                  width={width}
                  itemCount={dragons.length}
                  itemSize={128}
                  itemData={dragons}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
}
