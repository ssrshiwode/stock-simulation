import React, { useEffect, useContext, useState } from "react";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import * as echarts from "echarts";
import { cloneDeep } from "lodash";
import moment from "moment";
import { RootContext, IRootContext, UPDATE_ITEM } from "../utils/store";
import { getKline } from "../api";

const option: any = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      animation: false,
      type: "cross",
      lineStyle: {
        color: "#376df4",
        width: 2,
        opacity: 1,
      },
    },
  },
  xAxis: {
    type: "category",
    data: [],
    axisLine: { lineStyle: { color: "#8392A5" } },
  },
  yAxis: {
    scale: true,
    axisLine: { lineStyle: { color: "#8392A5" } },
    splitLine: { show: false },
  },
  grid: {
    bottom: 80,
  },
  dataZoom: [
    {
      textStyle: {
        color: "#8392A5",
      },
      handleIcon:
        "path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
      dataBackground: {
        areaStyle: {
          color: "#8392A5",
        },
        lineStyle: {
          opacity: 0.8,
          color: "#8392A5",
        },
      },
      brushSelect: true,
    },
    {
      type: "inside",
    },
  ],
  series: [
    {
      type: "candlestick",
      name: "日K",
      data: [[]],
      itemStyle: {
        color: "#FD1050",
        color0: "#0CF49B",
        borderColor: "#FD1050",
        borderColor0: "#0CF49B",
      },
    },
    {
      type: "line",
      name: "尾盘价格",
      data: [],
      smooth: true,
      lineStyle: {
        opacity: 0.3,
      },
    },
  ],
};

function calculateMA(dayCount: number, data: []) {
  var result = [];
  for (var i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += +data[i - j][1];
    }
    result.push(sum / dayCount);
  }
  return result;
}

const Chart: React.FC = () => {
  const {
    state: { stock },
    dispatch,
  } = useContext(RootContext) as IRootContext;
  const [years, setYears] = useState(1);
  useEffect(() => {
    const chartDom = document.getElementById("chart");
    if (chartDom && !echarts.getInstanceByDom(chartDom)) {
      const chart = chartDom && echarts.init(chartDom);
      chart && chart.setOption(option);
    }
  }, []);

  useEffect(() => {
    const fetchData = async (stock: string) => {
      const res = await getKline({
        symbol: stock,
        begin: moment().valueOf(),
        period: "day",
        type: "before",
        count: -years * 365,
        indicator: "kline",
      });
      if (res.data && res.data.item) {
        const item = res.data.item;
        const formatItem = item.map((d) => {
          if (!d) return [];
          return [d[0], d[2], d[5], d[4], d[3]];
        });
        dispatch({ type: UPDATE_ITEM, value: formatItem });
        const chartDom = document.getElementById("chart");
        const chart = chartDom && echarts.getInstanceByDom(chartDom);
        const updateOption = cloneDeep(option);
        updateOption.xAxis.data = item.map((d) => {
          if (!d || !Array.isArray(d)) return null;
          return moment(d[0]).format("YYYY/MM/DD");
        });
        updateOption.series[0].data = item.map((d) => {
          if (!d || !Array.isArray(d)) return [];
          //[open, close, lowest, highest] （即：[开盘值, 收盘值, 最低值, 最高值]）
          return [d[2], d[5], d[4], d[3]];
        });
        updateOption.series[1].data = item.map((d) => {
          if (!d || !Array.isArray(d)) return [];
          //[open, close, lowest, highest] （即：[开盘值, 收盘值, 最低值, 最高值]）
          return d[5];
        });
        chart?.setOption(updateOption, true);
      }
    };
    if (stock) fetchData(stock);
  }, [dispatch, stock, years]);

  const yearsOption = new Array(10)
    .fill(null)
    .map((_, index) => index + 1)
    .reverse()
    .map((d) => {
      return {
        label: `${d}年`,
        value: d,
      };
    });

  return (
    <div className="app__right">
      <Radio.Group
        className="radio-group"
        options={yearsOption}
        value={years}
        onChange={({ target: { value } }: RadioChangeEvent) => setYears(value)}
        optionType="button"
      />
      <div id="chart"></div>
    </div>
  );
};

export default Chart;
