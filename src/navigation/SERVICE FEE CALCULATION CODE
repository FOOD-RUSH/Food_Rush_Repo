import React, { useState } from 'react';
import { DollarSign, Package, TrendingUp, Users, Settings } from 'lucide-react';

const DeliveryFeeCalculator = () => {
  const [orderValue, setOrderValue] = useState(5000);
  const [country, setCountry] = useState('cameroon');
  const [customIncome, setCustomIncome] = useState(180000);
  const [showSettings, setShowSettings] = useState(false);
  
  const marketData = {
    us: { name: 'United States', income: 4500, currency: '$', affordabilityRate: 0.015, multiplier: 1 },
    uk: { name: 'United Kingdom', income: 3200, currency: '£', affordabilityRate: 0.015, multiplier: 1 },
    india: { name: 'India', income: 500, currency: '₹', affordabilityRate: 0.012, multiplier: 1 },
    mexico: { name: 'Mexico', income: 800, currency: '$', affordabilityRate: 0.015, multiplier: 1 },
    brazil: { name: 'Brazil', income: 900, currency: 'R$', affordabilityRate: 0.015, multiplier: 1 },
    cameroon: { name: 'Cameroon (CFA)', income: customIncome, currency: 'CFA', affordabilityRate: 0.015, multiplier: 1 }
  };
  
  const market = marketData[country];
  
  const calculateServiceFee = (value) => {
    const multiplier = market.multiplier;
    let feePercentage;
    let baseFee;
    
    const small = 2000 * multiplier;
    const medium = 5000 * multiplier;
    const large = 10000 * multiplier;
    
    if (value < small) {
      feePercentage = 0.12;
      baseFee = 300 * multiplier;
    } else if (value < medium) {
      feePercentage = 0.10;
      baseFee = 250 * multiplier;
    } else if (value < large) {
      feePercentage = 0.08;
      baseFee = 200 * multiplier;
    } else {
      feePercentage = 0.06;
      baseFee = 150 * multiplier;
    }
    
    return (value * feePercentage) + baseFee;
  };
  
  const serviceFee = calculateServiceFee(orderValue);
  const deliveryFee = 500 * market.multiplier;
  const totalFees = serviceFee + deliveryFee;
  const totalOrder = orderValue + totalFees;
  
  const maxAffordableFee = market.income * market.affordabilityRate;
  const isAffordable = totalFees <= maxAffordableFee;
  const affordabilityPercentage = (totalFees / maxAffordableFee) * 100;
  
  const formatCurrency = (value) => {
    if (market.currency === 'CFA') {
      return `${value.toLocaleString()} ${market.currency}`;
    }
    return `${market.currency}${value.toFixed(2)}`;
  };
  
  const getMaxOrderValue = () => {
    if (country === 'cameroon') {
      return Math.max(50000, customIncome * 0.5);
    }
    return 100;
  };
  
  const getMinOrderValue = () => {
    return country === 'cameroon' ? 500 : 5;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Food Delivery Fee Estimator
          </h1>
          <p className="text-gray-600">
            Affordable pricing model targeting 70% population accessibility
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="text-orange-500" size={24} />
              Order Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {Object.entries(marketData).map(([key, data]) => (
                    <option key={key} value={key}>{data.name}</option>
                  ))}
                </select>
              </div>
              
              {country === 'cameroon' && (
                <div>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 mb-2"
                  >
                    <Settings size={16} />
                    {showSettings ? 'Hide Settings' : 'Adjust Income Level'}
                  </button>
                  
                  {showSettings && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Monthly Income (70th percentile): {customIncome.toLocaleString()} CFA
                      </label>
                      <input
                        type="range"
                        min="50000"
                        max="500000"
                        step="10000"
                        value={customIncome}
                        onChange={(e) => setCustomIncome(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>50k CFA</span>
                        <span>500k CFA</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Value: {formatCurrency(orderValue)}
                </label>
                <input
                  type="number"
                  value={orderValue}
                  onChange={(e) => setOrderValue(Number(e.target.value))}
                  min={getMinOrderValue()}
                  max={getMaxOrderValue()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-2"
                />
                <input
                  type="range"
                  min={getMinOrderValue()}
                  max={getMaxOrderValue()}
                  step={country === 'cameroon' ? 500 : 1}
                  value={orderValue}
                  onChange={(e) => setOrderValue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatCurrency(getMinOrderValue())}</span>
                  <span>{formatCurrency(getMaxOrderValue())}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-green-500" size={24} />
              Fee Breakdown
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Order Subtotal</span>
                <span className="font-semibold">{formatCurrency(orderValue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-semibold text-orange-600">{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-orange-600">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-orange-50 px-3 rounded-lg">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-xl text-orange-600">{formatCurrency(totalOrder)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Total fees: {((totalFees / orderValue) * 100).toFixed(1)}% of order value
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="text-blue-500" size={24} />
            Affordability Analysis (70% Population Target)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Monthly Income (P70)</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(market.income)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Max Affordable Fee (1.5%)</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(maxAffordableFee)}</p>
            </div>
            <div className={`rounded-lg p-4 ${isAffordable ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-sm text-gray-600 mb-1">Affordability Status</p>
              <p className={`text-2xl font-bold ${isAffordable ? 'text-green-600' : 'text-red-600'}`}>
                {isAffordable ? '✓ Affordable' : '✗ Too High'}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Fee as % of affordable limit</span>
              <span className="font-semibold">{affordabilityPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  affordabilityPercentage <= 100 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(affordabilityPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-indigo-500" size={24} />
            Tiered Pricing Strategy {country === 'cameroon' && '(CFA)'}
          </h2>
          
          {country === 'cameroon' ? (
            <>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Small Orders</p>
                  <p className="text-xs text-gray-600 mb-2">&lt; 2,000 CFA</p>
                  <p className="text-lg font-bold text-orange-600">12% + 300 CFA</p>
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Medium Orders</p>
                  <p className="text-xs text-gray-600 mb-2">2k - 5k CFA</p>
                  <p className="text-lg font-bold text-orange-600">10% + 250 CFA</p>
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Large Orders</p>
                  <p className="text-xs text-gray-600 mb-2">5k - 10k CFA</p>
                  <p className="text-lg font-bold text-orange-600">8% + 200 CFA</p>
                </div>
                <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
                  <p className="text-sm font-semibold text-gray-800 mb-2">XL Orders</p>
                  <p className="text-xs text-gray-600 mb-2">&gt; 10k CFA</p>
                  <p className="text-lg font-bold text-orange-600">6% + 150 CFA</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-1">Delivery Fee: 500 CFA (flat rate)</p>
                <p className="text-xs text-blue-600">Encourages order consolidation and remains affordable</p>
              </div>
            </>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Small Orders</p>
                <p className="text-xs text-gray-600 mb-2">&lt; {market.currency}10</p>
                <p className="text-lg font-bold text-orange-600">15% + {market.currency}1.50</p>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Medium Orders</p>
                <p className="text-xs text-gray-600 mb-2">{market.currency}10-25</p>
                <p className="text-lg font-bold text-orange-600">12% + {market.currency}1.00</p>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Large Orders</p>
                <p className="text-xs text-gray-600 mb-2">{market.currency}25-50</p>
                <p className="text-lg font-bold text-orange-600">10% + {market.currency}0.50</p>
              </div>
              <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
                <p className="text-sm font-semibold text-gray-800 mb-2">XL Orders</p>
                <p className="text-xs text-gray-600 mb-2">&gt; {market.currency}50</p>
                <p className="text-lg font-bold text-orange-600">8% only</p>
              </div>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Key Principles:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Progressive fees: Higher order values = lower percentage rates</li>
              <li>• Base fees protect small order economics while staying affordable</li>
              <li>• Target: Keep total fees under 1.5% of monthly income (70th percentile)</li>
              <li>• Flat delivery fee encourages order consolidation</li>
              <li>• Lower affordability threshold (1.5% vs 2%) ensures accessibility for 70% of population</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryFeeCalculator;