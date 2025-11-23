import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Search as SearchIcon, Filter, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search data
  const allTransactions = [
    {
      id: 1,
      type: "sent",
      recipient: "Sarah Johnson",
      amount: 45.00,
      time: "2024-01-15",
      category: "Food & Dining",
      avatar: "SJ"
    },
    {
      id: 2,
      type: "received",
      sender: "Mike Chen",
      amount: 120.00,
      time: "2024-01-14",
      category: "Freelance",
      avatar: "MC"
    },
    {
      id: 3,
      type: "sent",
      recipient: "Coffee Shop",
      amount: 8.50,
      time: "2024-01-13",
      category: "Food & Dining",
      avatar: "CS"
    },
    {
      id: 4,
      type: "received",
      sender: "Emma Davis",
      amount: 25.00,
      time: "2024-01-12",
      category: "Split Bill",
      avatar: "ED"
    },
    {
      id: 5,
      type: "sent",
      recipient: "Uber",
      amount: 15.75,
      time: "2024-01-11",
      category: "Transportation",
      avatar: "UB"
    },
    {
      id: 6,
      type: "sent",
      recipient: "Netflix",
      amount: 12.99,
      time: "2024-01-10",
      category: "Entertainment",
      avatar: "NF"
    }
  ];

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      if (searchQuery.trim()) {
        const results = allTransactions.filter(transaction => 
          (transaction.recipient?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (transaction.sender?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.amount.toString().includes(searchQuery)
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() === "") {
      setSearchResults([]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="pt-4">
          <h1>Search</h1>
          <p className="text-muted-foreground">Find transactions, contacts, and more</p>
        </div>

        {/* Search Bar */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions, contacts..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button size="icon" variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="w-full"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Quick Search Categories */}
        {!searchQuery && (
          <div className="space-y-4">
            <h2>Quick Search</h2>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => {
                  setSearchQuery("Food");
                  handleSearch();
                }}
              >
                <span>🍽️</span>
                <span className="text-xs">Food & Dining</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => {
                  setSearchQuery("Transportation");
                  handleSearch();
                }}
              >
                <span>🚗</span>
                <span className="text-xs">Transportation</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => {
                  setSearchQuery("Entertainment");
                  handleSearch();
                }}
              >
                <span>🎬</span>
                <span className="text-xs">Entertainment</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col gap-2"
                onClick={() => {
                  setSearchQuery("Freelance");
                  handleSearch();
                }}
              >
                <span>💼</span>
                <span className="text-xs">Freelance</span>
              </Button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2>Search Results</h2>
              <Badge variant="secondary">{searchResults.length} found</Badge>
            </div>
            
            <div className="space-y-3">
              {searchResults.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{transaction.avatar}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm">
                            {transaction.type === 'sent' ? transaction.recipient : transaction.sender}
                          </p>
                          {transaction.type === 'sent' ? (
                            <ArrowUpRight className="h-4 w-4 text-destructive" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{transaction.time}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-sm ${
                          transaction.type === 'sent' ? 'text-destructive' : 'text-green-600'
                        }`}>
                          {transaction.type === 'sent' ? '-' : '+'}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3>No results found</h3>
            <p className="text-muted-foreground mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
}