import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Input, Modal, message, Statistic, Form } from 'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import millify from 'millify';
import Loader from './Loader';

const { Title } = Typography;

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const { data: cryptosList, isFetching } = useGetCryptosQuery(100);
  const [form] = Form.useForm();

  // Load portfolio from localStorage on component mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
  }, []);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const handleAddCoin = () => {
    if (!selectedCoin || !amount || !purchasePrice) {
      message.error('Please fill in all fields');
      return;
    }

    const coin = cryptosList?.data?.coins.find(c => c.name === selectedCoin);
    if (!coin) {
      message.error('Invalid coin selected');
      return;
    }

    const newPortfolioItem = {
      id: coin.uuid,
      name: coin.name,
      symbol: coin.symbol,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: parseFloat(coin.price),
      value: parseFloat(amount) * parseFloat(purchasePrice),
      change: parseFloat(coin.change),
      iconUrl: coin.iconUrl
    };

    setPortfolio([...portfolio, newPortfolioItem]);
    setIsModalVisible(false);
    resetForm();
    message.success('Coin added to portfolio');
  };

  const resetForm = () => {
    setSelectedCoin('');
    setAmount('');
    setPurchasePrice('');
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const onCoinSelect = (value) => {
    setSelectedCoin(value);
    const coin = cryptosList?.data?.coins.find(c => c.name === value);
    if (coin) {
      setPurchasePrice(coin.price); // Set current price as default purchase price
    }
  };

  const removeCoin = (coinId) => {
    setPortfolio(portfolio.filter(coin => coin.id !== coinId));
    message.success('Coin removed from portfolio');
  };

  const calculateProfitLoss = (coin) => {
    const currentCoin = cryptosList?.data?.coins.find(c => c.uuid === coin.id);
    if (!currentCoin) return { value: 0, percentage: 0 };

    const currentValue = coin.amount * parseFloat(currentCoin.price);
    const initialValue = coin.amount * coin.purchasePrice;
    const profitLoss = currentValue - initialValue;
    const profitLossPercentage = (profitLoss / initialValue) * 100;

    return {
      value: profitLoss,
      percentage: profitLossPercentage,
      currentValue: currentValue,
      change: currentCoin.change
    };
  };

  const getTotalValue = () => {
    return portfolio.reduce((total, coin) => {
      const { currentValue } = calculateProfitLoss(coin);
      return total + currentValue;
    }, 0);
  };

  const getTotalProfitLoss = () => {
    return portfolio.reduce((total, coin) => {
      const { value } = calculateProfitLoss(coin);
      return total + value;
    }, 0);
  };

  if (isFetching) return <Loader />;

  const totalProfitLoss = getTotalProfitLoss();
  const totalValue = getTotalValue();

  return (
    <>
      <div className="portfolio-header" style={{ textAlign: 'center', margin: '20px 0' }}>
        <Title level={2}>Your Crypto Portfolio</Title>
        <Row justify="center" gutter={[32, 32]}>
          <Col>
            <Card>
              <Statistic
                title="Total Portfolio Value"
                value={totalValue}
                precision={2}
                prefix="$"
              />
            </Card>
          </Col>
          <Col>
            <Card>
              <Statistic
                title="Total Profit/Loss"
                value={totalProfitLoss}
                precision={2}
                prefix="$"
                valueStyle={{ color: totalProfitLoss >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={totalProfitLoss >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix={`(${((totalProfitLoss / (totalValue - totalProfitLoss)) * 100).toFixed(2)}%)`}
              />
            </Card>
          </Col>
        </Row>
        <Button 
          type="primary" 
          onClick={() => setIsModalVisible(true)}
          style={{ margin: '20px 0' }}
        >
          Add New Coin
        </Button>
      </div>

      <Row gutter={[32, 32]} className="crypto-card-container">
        {portfolio.map((coin) => {
          const { value, percentage, currentValue, change } = calculateProfitLoss(coin);
          const isProfit = percentage >= 0;

          return (
            <Col xs={24} sm={12} lg={6} className="crypto-card" key={coin.id}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={coin.iconUrl} alt={coin.name} style={{ width: '25px', height: '25px' }} />
                    {`${coin.name} (${coin.symbol})`}
                  </div>
                }
                extra={
                  <Button 
                    danger 
                    onClick={() => removeCoin(coin.id)}
                    style={{
                      color: '#ff4d4f',
                      borderColor: '#ff4d4f'
                    }}
                    className="remove-button"
                  >
                    Remove
                  </Button>
                }
              >
                <p>Amount: {coin.amount}</p>
                <p>Purchase Price: ${millify(coin.purchasePrice)}</p>
                <p>Current Value: ${millify(currentValue)}</p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: isProfit ? '#3f8600' : '#cf1322',
                  marginTop: '10px'
                }}>
                  {isProfit ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  <span style={{ marginLeft: '5px' }}>
                    {isProfit ? '+' : ''}{percentage.toFixed(2)}%
                  </span>
                </div>
                <p style={{ 
                  color: isProfit ? '#3f8600' : '#cf1322',
                  marginTop: '5px'
                }}>
                  Profit/Loss: ${millify(value)}
                </p>
                <p style={{
                  color: change >= 0 ? '#3f8600' : '#cf1322',
                  fontSize: '12px',
                  marginTop: '5px'
                }}>
                  24h Change: {change >= 0 ? '+' : ''}{change}%
                </p>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title="Add Coin to Portfolio"
        visible={isModalVisible}
        onOk={handleAddCoin}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            label="Select Coin"
            required
            rules={[{ required: true, message: 'Please select a coin' }]}
          >
            <select
              style={{ width: '100%', padding: '8px' }}
              value={selectedCoin}
              onChange={(e) => onCoinSelect(e.target.value)}
            >
              <option value="">Select a coin</option>
              {cryptosList?.data?.coins.map((coin) => (
                <option key={coin.uuid} value={coin.name}>
                  {coin.name} ({coin.symbol}) - Current Price: ${millify(coin.price)}
                </option>
              ))}
            </select>
          </Form.Item>

          <Form.Item
            label="Purchase Price (USD)"
            required
            rules={[{ required: true, message: 'Please enter purchase price' }]}
          >
            <Input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="Enter your purchase price"
              min="0"
              step="0.000001"
            />
          </Form.Item>

          <Form.Item
            label="Amount"
            required
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount of coins"
              min="0"
              step="0.000001"
            />
          </Form.Item>

          {selectedCoin && purchasePrice && amount && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
              <p><strong>Total Investment:</strong> ${millify(parseFloat(purchasePrice) * parseFloat(amount))}</p>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Portfolio; 