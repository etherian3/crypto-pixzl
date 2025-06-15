
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PriceHistory } from '@/services/cryptoService';

interface PriceChartProps {
  data: PriceHistory;
  coinName: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, coinName }) => {
  const chartData = data.prices.map(([timestamp, price]) => ({
    time: new Date(timestamp).toLocaleDateString(),
    price: price,
    timestamp: timestamp
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="pixel-card bg-card border-pixel-green text-xs">
          <p className="font-pixel text-pixel-green text-[10px] md:text-xs">{label}</p>
          <p className="font-pixel text-foreground text-[10px] md:text-xs">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pixel-card bg-card w-full">
      <h3 className="font-pixel text-xs md:text-sm text-pixel-green mb-3 md:mb-4">
        {coinName.toUpperCase()} PRICE CHART
      </h3>
      <div className="h-48 md:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontFamily: '"Press Start 2P"' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fontFamily: '"Press Start 2P"' }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#00ff41" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: '#00ff41' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
