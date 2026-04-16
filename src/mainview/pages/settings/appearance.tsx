import { useState, useEffect, useCallback } from "react";
import { rpc } from "@/lib/rpc";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type SidebarDefault = "expanded" | "collapsed";

export function AppearanceSettings() {
  const [sidebarDefault, setSidebarDefault] = useState<SidebarDefault>("expanded");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;
    rpc.getSettings("appearance").then((settings) => {
      if (cancelled) return;
      const raw = settings["sidebar_default"];
      if (raw === "expanded" || raw === "collapsed") {
        setSidebarDefault(raw);
      }
      setIsDirty(false);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await rpc.saveSetting("sidebar_default", sidebarDefault, "appearance");
      setIsDirty(false);
      toast("success", "Appearance settings saved.");
      window.dispatchEvent(new CustomEvent("autodesk:sidebar-default-changed", { detail: { sidebarDefault } }));
    } catch {
      toast("error", "Failed to save appearance settings.");
    } finally {
      setIsSaving(false);
    }
  }, [sidebarDefault]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Customise how AutoDesk looks and feels.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Display</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="sidebar-default-select">Sidebar Default State</Label>
              <p className="text-xs text-muted-foreground">
                Whether the sidebar opens expanded or collapsed on launch.
              </p>
            </div>
            <Select
              value={sidebarDefault}
              onValueChange={(val) => {
                setSidebarDefault(val as SidebarDefault);
                setIsDirty(true);
              }}
            >
              <SelectTrigger id="sidebar-default-select" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expanded">Expanded</SelectItem>
                <SelectItem value="collapsed">Collapsed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
