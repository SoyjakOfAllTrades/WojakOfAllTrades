import {
  Activity,
  BarChart3,
  Calendar,
  Crown,
  Gem,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import type React from 'react';

interface WojakStatsProps {
  stats: {
    total: number;
    byRarity: {
      common: number;
      uncommon: number;
      rare: number;
      epic: number;
      legendary: number;
    };
    totalMinted: number;
    nextId: number;
  };
}

export const WojakStats: React.FC<WojakStatsProps> = ({ stats }) => {
  const rarityData = [
    {
      name: 'Legendary',
      count: stats.byRarity.legendary,
      color: 'text-stonks-warning',
      bgColor: 'bg-stonks-warning/40',
      icon: Crown,
    },
    {
      name: 'Epic',
      count: stats.byRarity.epic,
      color: 'text-stonks-accent',
      bgColor: 'bg-stonks-accent/40',
      icon: Gem,
    },
    {
      name: 'Rare',
      count: stats.byRarity.rare,
      color: 'text-stonks-green',
      bgColor: 'bg-stonks-green/40',
      icon: Zap,
    },
    {
      name: 'Uncommon',
      count: stats.byRarity.uncommon,
      color: 'text-stonks-light',
      bgColor: 'bg-stonks-light/40',
      icon: Star,
    },
    {
      name: 'Common',
      count: stats.byRarity.common,
      color: 'text-stonks-light/60',
      bgColor: 'bg-stonks-gray/70',
      icon: Trophy,
    },
  ];

  const totalRarity = Object.values(stats.byRarity).reduce((sum, count) => sum + count, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-4 shadow-2xl backdrop-blur-sm">
      {/* Subtle pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

      <div className="relative z-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Collection Statistics Column */}
        <div>
          <h3 className="stonks-text mb-3 flex items-center space-x-2 font-bold font-orbitron text-lg">
            <BarChart3 className="h-4 w-4 text-stonks-green" />
            <span>COLLECTION STATISTICS</span>
          </h3>
          <div className="space-y-2">
            <div className="rounded-lg border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-lg backdrop-blur-sm">
              <div className="mb-1 flex items-center space-x-2">
                <Users className="h-4 w-4 text-stonks-green" />
                <span className="font-rajdhani font-semibold text-stonks-light text-xs uppercase tracking-wider">
                  TOTAL WOJAKS
                </span>
              </div>
              <div className="stonks-text font-bold font-orbitron text-2xl">{stats.total}</div>
              <div className="font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-wider">
                IN COLLECTION
              </div>
            </div>

            <div className="rounded-lg border border-stonks-accent/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-lg backdrop-blur-sm">
              <div className="mb-1 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-stonks-accent" />
                <span className="font-rajdhani font-semibold text-stonks-light text-xs uppercase tracking-wider">
                  TOTAL MINTED
                </span>
              </div>
              <div className="stonks-text font-bold font-orbitron text-2xl">
                {stats.totalMinted}
              </div>
              <div className="font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-wider">
                ALL TIME
              </div>
            </div>
          </div>
        </div>

        {/* Rarity Distribution Column */}
        <div>
          <h3 className="stonks-text mb-3 flex items-center space-x-2 font-bold font-orbitron text-lg">
            <Activity className="h-4 w-4 text-stonks-accent" />
            <span>RARITY DISTRIBUTION</span>
          </h3>
          <div className="space-y-2">
            {rarityData.map((rarity) => {
              const Icon = rarity.icon;
              const percentage = totalRarity > 0 ? (rarity.count / totalRarity) * 100 : 0;

              return (
                <div
                  key={rarity.name}
                  className="rounded-lg border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-lg backdrop-blur-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-4 w-4 ${rarity.color}`} />
                      <span className="font-rajdhani font-semibold text-stonks-light text-xs uppercase tracking-wider">
                        {rarity.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="stonks-text font-bold font-orbitron text-sm">
                        {rarity.count}
                      </span>
                      <span className="font-medium font-mono text-stonks-light/60 text-xs">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full border border-stonks-gray/30 bg-stonks-darker/40">
                    <div
                      className={`h-2 rounded-full ${rarity.bgColor} shadow-lg transition-all duration-500 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trading Floor Stats */}
      <div className="relative z-10 mt-4 border-stonks-green/20 border-t pt-3">
        <h4 className="stonks-text mb-3 flex items-center space-x-2 font-bold font-orbitron text-base">
          <Target className="h-4 w-4 text-stonks-warning" />
          <span>TRADING FLOOR METRICS</span>
        </h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-stonks-warning/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 text-center shadow-lg backdrop-blur-sm">
            <div className="stonks-warning font-bold font-orbitron text-xl">
              {stats.total > 0 ? ((stats.byRarity.legendary / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-wider">
              LEGENDARY
            </div>
            <div className="font-rajdhani text-stonks-warning/60 text-xs">
              {stats.byRarity.legendary} cards
            </div>
          </div>

          <div className="rounded-lg border border-stonks-accent/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 text-center shadow-lg backdrop-blur-sm">
            <div className="stonks-accent font-bold font-orbitron text-xl">
              {stats.total > 0 ? ((stats.byRarity.epic / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <div className="font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-wider">
              EPIC
            </div>
            <div className="font-rajdhani text-stonks-accent/60 text-xs">
              {stats.byRarity.epic} cards
            </div>
          </div>

          <div className="rounded-lg border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 text-center shadow-lg backdrop-blur-sm">
            <div className="stonks-green font-bold font-orbitron text-xl">
              {stats.total > 0
                ? (
                    ((stats.byRarity.rare + stats.byRarity.epic + stats.byRarity.legendary) /
                      stats.total) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
            <div className="font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-wider">
              RARE+
            </div>
            <div className="font-rajdhani text-stonks-green/60 text-xs">
              {stats.byRarity.rare + stats.byRarity.epic + stats.byRarity.legendary} cards
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
