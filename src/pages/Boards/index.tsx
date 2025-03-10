import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Users,
  Layout,
  Filter,
  ChevronDown,
  PersonStanding,
  Settings,
  Sparkles,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const BoardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Board Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Project A</h1>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Users className="mr-2 h-4 w-4" />
              Workspace
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Layout className="mr-2 h-4 w-4" />
              Board
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <Sparkles className="mr-2 h-4 w-4" />
            Upgrade
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" className="h-8">
            <PersonStanding className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Board Toolbar */}
      <div className="flex items-center justify-between border-y border-border bg-card/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search cards..."
            className="h-8 w-64 bg-background"
          />
          <Button variant="outline" size="sm" className="h-8">
            <Users className="mr-2 h-4 w-4" />
            Members
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8">
            Calendar
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            Automation
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            Views
          </Button>
        </div>
      </div>

      {/* Board Content */}
      <main className="p-6">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Your columns will be rendered here */}
        </div>
      </main>
    </div>
  );
};

export default BoardPage;
