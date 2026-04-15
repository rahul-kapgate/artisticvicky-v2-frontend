import { useState } from "react";
import { AVATARS } from "@/components/avatar/avatars";
import { X } from "lucide-react";

interface AvatarPickerProps {
  currentId: number;
  onSelect: (id: number) => void;
  onClose: () => void;
}

export default function AvatarPicker({ currentId, onSelect, onClose }: AvatarPickerProps) {
  const [selected, setSelected] = useState(currentId);

  const handleSave = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Choose your avatar</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-5">
          <div
            className="rounded-2xl overflow-hidden flex-shrink-0 border border-white/20"
            style={{ width: 56, height: 56 }}
            dangerouslySetInnerHTML={{
              __html: (AVATARS.find((a) => a.id === selected) ?? AVATARS[0]).svg,
            }}
          />
          <div>
            <p className="text-white font-medium text-sm">
              {(AVATARS.find((a) => a.id === selected) ?? AVATARS[0]).name}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">Selected avatar</p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {AVATARS.map((av) => (
            <button
              key={av.id}
              onClick={() => setSelected(av.id)}
              className={`flex flex-col items-center gap-1.5 p-1.5 rounded-2xl border-2 transition-all ${
                selected === av.id
                  ? "border-orange-400 bg-orange-400/10"
                  : "border-transparent hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div
                className="rounded-xl overflow-hidden border border-white/10"
                style={{ width: 48, height: 48 }}
                dangerouslySetInnerHTML={{ __html: av.svg }}
              />
              <span
                className={`text-[10px] leading-tight text-center ${
                  selected === av.id ? "text-orange-300 font-medium" : "text-gray-400"
                }`}
              >
                {av.name}
              </span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/20 text-gray-300 text-sm hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition"
          >
            Save avatar
          </button>
        </div>

      </div>
    </div>
  );
}