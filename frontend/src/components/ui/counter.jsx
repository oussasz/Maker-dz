import React from "react";
import IconButton from "./icon-button";
import { Minus, Plus } from "lucide-react";

const Counter = ({ count, setCount }) => {
  return (
      <div className="p-2 rounded-full gap-2 border-gray-200 border flex items-center justify-between">
        <IconButton
          onClick={() => {
            if (count > 0) {
              setCount(count - 1);
            }
          }}
          icon={<Minus className="h-4 w-4"/>}
        />
        <span className="min-w-5 text-center">{count}</span>
        <IconButton onClick={() => setCount(count + 1)} icon={<Plus className="h-4 w-4"/>} />
    </div>
  );
};

export default Counter;
