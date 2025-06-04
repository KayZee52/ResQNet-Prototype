"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadCloud, WifiOff, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OfflineModePage() {
  const { toast } = useToast();

  const handleDownloadResources = () => {
    // Placeholder for download logic
    toast({ title: "Downloading...", description: "Critical resources are being downloaded (simulated)." });
    setTimeout(() => {
      toast({ title: "Download Complete!", description: "Resources are now available offline." });
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-lg mx-auto mt-4 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl text-primary">Offline Mode</CardTitle>
          <CardDescription>Access critical information even without an internet connection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-3 p-4 border rounded-lg bg-secondary/30">
            <WifiOff className="h-10 w-10 text-primary" />
            <div>
              <h4 className="font-semibold text-lg">Stay Prepared</h4>
              <p className="text-sm text-muted-foreground">
                ResQNet ensures you have access to essential safety features when you're offline.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">What's Available Offline?</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>First Aid Guides (visual and audio instructions once downloaded)</li>
              <li>Your Medical Profile (if saved on device)</li>
              <li>Emergency contact information</li>
              <li>Offline map data for your local area (future feature)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">How to Use Offline Mode:</h4>
            <p className="text-sm text-muted-foreground">
              Simply download the critical resources below. The app will automatically use these resources when no internet connection is detected.
            </p>
          </div>
          
          <Button onClick={handleDownloadResources} className="w-full" size="lg">
            <DownloadCloud className="mr-2 h-5 w-5" /> Download Critical Resources
          </Button>

          <div className="flex items-start space-x-3 p-3 border border-yellow-400 bg-yellow-50 rounded-lg text-yellow-700">
            <ShieldCheck className="h-6 w-6 mt-0.5 shrink-0" />
            <p className="text-sm">
              <strong>Note:</strong> Real-time features like AI Assistant and live Help Network updates require an internet connection. However, core safety information will be accessible.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
