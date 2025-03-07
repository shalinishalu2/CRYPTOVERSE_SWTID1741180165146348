import React from "react";
import millify from "millify";
import { Typography, Row, Col, Statistic } from "antd";
import { Link } from "react-router-dom";
import { useGetCryptosQuery } from "../services/cryptoApi";
import Cryptocurrencies from "./Cryptocurrencies";
import Loader from "./Loader";

const { Title } = Typography;

const Home = () => {
  const { data, isFetching, error } = useGetCryptosQuery(10);

  if (isFetching) return <Loader />;

  if (error) {
    return <Title level={3} style={{ color: "red" }}>Error loading data. Please try again later.</Title>;
  }

  console.log("Fetched Data:", data); // Debugging line to check API response

  const globalStats = data?.data?.stats;

  if (!globalStats) {
    return <Title level={3} style={{ color: "red" }}>No statistics available</Title>;
  }

  return (
    <>
      <Title level={2} className="heading">Global Crypto Stats</Title>
      <Row>
        <Col span={12}>
          <Statistic title="Total Cryptocurrencies" value={globalStats.total || "N/A"} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Exchanges" value={globalStats.totalExchanges ? millify(globalStats.totalExchanges) : "N/A"} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Market Cap" value={globalStats.totalMarketCap ? millify(globalStats.totalMarketCap) : "N/A"} />
        </Col>
        <Col span={12}>
          <Statistic title="Total 24h Volume" value={globalStats.total24hVolume ? millify(globalStats.total24hVolume) : "N/A"} />
        </Col>
        <Col span={12}>
          <Statistic title="Total Markets" value={globalStats.totalMarkets ? millify(globalStats.totalMarkets) : "N/A"} />
        </Col>
      </Row>
      <div className="home-heading-container">
        <Title level={2} className="home-title">
          Top 10 Cryptocurrencies in the World
        </Title>
        <Title level={3} className="show-more">
          <Link to="/cryptocurrencies">Show More</Link>
        </Title>
      </div>
      <Cryptocurrencies simplified />
    </>
  );
};

export default Home;
