import { X, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
}

export function AddTransactionModal({ isOpen, onClose, type }: AddTransactionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[380px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>
            Add {type === 'income' ? 'Income' : 'Expense'}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-4">
          <div>
            <Label htmlFor="amount">Amount (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              className="text-2xl h-14 rounded-xl mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger className="rounded-xl mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {type === 'income' ? (
                  <>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Add a note..."
              className="rounded-xl mt-1"
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <div className="relative mt-1">
              <Input
                id="date"
                type="date"
                className="rounded-xl"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 rounded-xl ${
                type === 'income'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Add {type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
