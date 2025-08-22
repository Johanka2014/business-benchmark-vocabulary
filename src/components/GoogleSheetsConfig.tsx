import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleSheetsConfigProps {
  onSheetsConfigured?: () => void;
  lastUpdated?: Date | null;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const GoogleSheetsConfig = ({ onSheetsConfigured, lastUpdated, onRefresh, isLoading }: GoogleSheetsConfigProps) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const { toast } = useToast();
  
  const currentSheetId = localStorage.getItem('google-sheet-id');

  const extractSheetId = (url: string): string | null => {
    const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleConfigure = () => {
    if (!sheetUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheets URL",
        variant: "destructive",
      });
      return;
    }

    const sheetId = extractSheetId(sheetUrl);
    if (!sheetId) {
      toast({
        title: "Error", 
        description: "Invalid Google Sheets URL. Please check the URL format.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('google-sheet-id', sheetId);
    toast({
      title: "Success",
      description: "Google Sheets configured successfully!",
    });
    
    setSheetUrl('');
    setIsConfiguring(false);
    onSheetsConfigured?.();
  };

  const handleRemoveConfig = () => {
    localStorage.removeItem('google-sheet-id');
    localStorage.removeItem('vocabulary-data');
    localStorage.removeItem('vocabulary-last-updated');
    
    toast({
      title: "Configuration Removed",
      description: "Google Sheets integration disabled. Using default data.",
    });
    
    onSheetsConfigured?.();
  };

  if (currentSheetId && !isConfiguring) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            Google Sheets Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-muted-foreground">
            Sheet ID: {currentSheetId.slice(0, 20)}...
          </div>
          {lastUpdated && (
            <div className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setIsConfiguring(true)}
              size="sm"
              variant="outline"
            >
              <Settings className="h-3 w-3" />
              Change
            </Button>
            <Button
              onClick={handleRemoveConfig}
              size="sm"
              variant="destructive"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          Connect Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">
          Connect your Google Sheets to automatically sync vocabulary data. Make sure your sheet is publicly viewable.
        </div>
        <div className="space-y-2">
          <Label htmlFor="sheet-url">Google Sheets URL</Label>
          <Input
            id="sheet-url"
            placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id..."
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleConfigure} size="sm">
            Connect
          </Button>
          {isConfiguring && (
            <Button 
              onClick={() => setIsConfiguring(false)} 
              size="sm" 
              variant="outline"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;