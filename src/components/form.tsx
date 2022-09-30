import React, { useState, useRef, useContext } from "react";
import {
  Select,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Button,
  Radio,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { debounce } from "lodash";
import moment from "moment";
import { RootContext, IRootContext, UPDATE_STOCK } from "../utils/store";
import { searchStock } from "../api";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface DataType {
  tradeRange: [number, number];
  buyDay: number;
  sellDay: number;
  holdDay: number;
  profit: number;
}

const renderProfit = (profit: number) => {
  if (profit === 0) return <Tag color="#ccc">0%</Tag>;
  if (profit > 0)
    return (
      <Tag color="#d20">{Number.prototype.toFixed.call(profit * 100, 0)}%</Tag>
    );
  return (
    <Tag color="#093">{Number.prototype.toFixed.call(profit * 100, 0)}%</Tag>
  );
};

const columns: ColumnsType<DataType> = [
  {
    title: "顺序",
    render: (_, __, index) => index + 1,
  },
  {
    title: "交易时间",
    dataIndex: "tradeRange",
    render: (tradeRange) =>
      `${moment(tradeRange[0]).format("YYYY-MM-DD")}~${moment(
        tradeRange[1]
      ).format("YYYY-MM-DD")}`,
  },
  {
    title: "买入日期",
    dataIndex: "buyDay",
    render: (buyDay) => moment(buyDay).format("YYYY-MM-DD"),
  },
  {
    title: "卖出日期",
    dataIndex: "sellDay",
    render: (sellDay) => moment(sellDay).format("YYYY-MM-DD"),
  },
  {
    title: "持仓天数",
    dataIndex: "holdDay",
  },
  {
    title: "利润",
    dataIndex: "profit",
    render: (profit) => renderProfit(profit),
  },
];

const Form: React.FC = () => {
  const {
    state: { item },
    dispatch,
  } = useContext(RootContext) as IRootContext;
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const searchKeyword = useRef("");
  const [asset, setAsset] = useState("10000");
  const [dateRange, setDateRange] = useState<any>(null);
  const [options, setOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const onSearch = debounce(async (keyword: string) => {
    searchKeyword.current = keyword;
    const res = await searchStock({ q: keyword });
    if (res.data && Array.isArray(res.data))
      setOptions(
        res.data.map(({ code, query }) => {
          return {
            label: query,
            value: code,
          };
        })
      );
  }, 1000);

  const onChange = (value: string) => {
    dispatch({ type: UPDATE_STOCK, value });
  };

  const clickHandle = () => {
    const start = dateRange[0]
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .valueOf();
    const end = dateRange[1]
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
      .valueOf();
    const tradeRange = item.filter((d) => d[0] > start && d[0] < end);
    const closeArray = tradeRange.map((d) => d[2]);
    const length = tradeRange.length;
    const buyIndexArray = [];
    let buyIndex = 0,
      sellIndex = 0;
    let min = Infinity;
    let profit = 0;
    for (let index = 0; index < length; index++) {
      const price = closeArray[index];
      if (price < min) {
        min = price;
        buyIndexArray.push(index);
      }
      const curProfit = price - min;
      if (curProfit > profit) {
        profit = curProfit;
        sellIndex = index;
        buyIndex = buyIndexArray[buyIndexArray.length - 1];
      }
    }
    const result: DataType = {
      tradeRange: [tradeRange[0][0], tradeRange[tradeRange.length - 1][0]],
      buyDay: tradeRange[buyIndex][0],
      sellDay: tradeRange[sellIndex][0],
      holdDay: tradeRange.filter(
        (d) =>
          d[0] >= tradeRange[buyIndex][0] && d[0] <= tradeRange[sellIndex][0]
      ).length,
      profit: Math.floor((profit / closeArray[buyIndex]) * 100) / 100,
    };
    setDataSource((data) => {
      return [...data, result];
    });
  };

  return (
    <div className="app__left">
      <Row gutter={24} className="row">
        <Col span={4} className="label">
          搜索股票:
        </Col>
        <Col span={12}>
          <Select
            showSearch
            placeholder="搜索"
            style={{ width: 200 }}
            onSearch={onSearch}
            onChange={onChange}
            dropdownMatchSelectWidth={false}
            filterOption={false}
            optionLabelProp="children"
          >
            {options.map(({ label, value }) => {
              const text = `${label}(${value})`;
              if (text.indexOf(searchKeyword.current) === -1)
                return (
                  <Option key={value} value={value}>
                    {text}
                  </Option>
                );
              const left = text.split(searchKeyword.current)[0] || "";
              const right = text.split(searchKeyword.current)[1] || "";
              const render = (
                <>
                  {`${left}`}
                  <span style={{ color: "#06c" }}>{searchKeyword.current}</span>
                  {`${right}`}
                </>
              );
              return (
                <Option key={value} value={value}>
                  {render}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      <Row gutter={24} className="row">
        <Col span={4} className="label">
          模拟资产:
        </Col>
        <Col span={12}>
          <InputNumber
            value={asset}
            onChange={(value) => value && setAsset(value)}
            formatter={(value) =>
              `￥ ${value}`.replace(/\B(?=(\d{4})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/￥\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <Row gutter={24} className="row">
        <Col span={4} className="label">
          交易时间:
        </Col>
        <Col span={12}>
          <RangePicker
            value={dateRange}
            onChange={(value) => value && setDateRange(value)}
            order
          />
        </Col>
      </Row>
      <Row gutter={24} className="row">
        <Col span={4} className="label">
          交易策略:
        </Col>
        <Col span={12} className="radio-group">
          <Radio.Group>
            <Tooltip
              placement="left"
              title={
                <ul>
                  <li>已知价格</li>
                  <li>一次交易</li>
                  <li>最大收益</li>
                  <li>尾盘操作</li>
                </ul>
              }
              color="#108ee9"
            >
              <Radio value={1}>策略一</Radio>
            </Tooltip>
            <Radio value={2}>策略二</Radio>
            <Radio value={3}>策略三</Radio>
            <Radio value={4}>策略四</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <Row gutter={24} className="row">
        <Col span={4} className="label"></Col>
        <Col span={12}>
          <Button type="primary" onClick={clickHandle}>
            开始模拟
          </Button>
        </Col>
      </Row>
      <Row gutter={24} className="row">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey="index"
        />
      </Row>
    </div>
  );
};

export default Form;
