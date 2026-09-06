import React, { useState, useEffect } from 'react';
import { historyService } from '@/services/api/historyService';
import type { RouteHistoryItem } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, EmptyState, Skeleton, Alert } from '@/components/ui';
import { formatDistance, formatDuration } from '@/utils/formatters';
import { History, Trash2, ArrowRight, RotateCw, MapPin, Flag, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<RouteHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await historyService.getHistory();
      setItems(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load route history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await historyService.deleteHistoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      alert('Failed to delete history item');
    }
  };

  const handleRepeatRoute = (item: RouteHistoryItem) => {
    navigate('/home', { state: { origin: item.origin, destination: item.destination } });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-100 flex items-center gap-2.5">
            <History className="w-6 h-6 text-brand-400" />
            <span>Optimization History</span>
          </h1>
          <p className="text-xs text-surface-400 mt-1">
            Authoritative persistent records of completed QIGA quantum multi-objective routing jobs.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchHistory}
          leftIcon={<RotateCw className="w-3.5 h-3.5" />}
        >
          Refresh History
        </Button>
      </div>

      {error && (
        <Alert variant="error" title="History Unavailable">
          {error}
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<History className="w-6 h-6 text-surface-400" />}
          title="No Route History Yet"
          description="Plan and optimize your first route using QIGA to inspect your trajectory records here."
          actionLabel="Plan New Route"
          onAction={() => navigate('/home')}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} variant="glass" className="hover:border-surface-700 transition-all">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={item.algorithm === 'QIGA' ? 'quantum' : 'neutral'} size="sm">
                      {item.algorithm}
                    </Badge>
                    <Badge variant="brand" size="sm">
                      {item.vehicleType.replace('_', ' ')}
                    </Badge>
                    <span className="text-[11px] text-surface-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Waypoints */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-surface-200 truncate">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                      <span className="truncate">{item.origin.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-surface-200 truncate">
                      <Flag className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{item.destination.address}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 text-xs text-surface-300 shrink-0 border-t md:border-t-0 md:border-l border-surface-800 pt-3 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-[10px] text-surface-400 block">Duration</span>
                    <span className="font-semibold text-surface-100">{formatDuration(item.durationSeconds)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-surface-400 block">Distance</span>
                    <span className="font-semibold text-surface-100">{formatDistance(item.distanceMeters)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-surface-400 block">CO₂ Saved</span>
                    <span className="font-semibold text-emerald-400">+{item.co2SavedKg} kg</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleRepeatRoute(item)}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5 text-surface-950" />}
                  >
                    Repeat
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="text-surface-400 hover:text-rose-400"
                    aria-label="Delete route record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
