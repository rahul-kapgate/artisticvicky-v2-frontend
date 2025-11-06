import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface CustomWarningDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function CustomWarningDialog({ open, onClose, onConfirm }: CustomWarningDialogProps) {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent
                    className="
          bg-gradient-to-b from-[#0f1b3d] via-[#1a1f4f] to-[#1a237e]
          text-gray-100 border border-red-400/20 rounded-2xl
          backdrop-blur-lg shadow-2xl max-w-md
          animate-in fade-in-90 zoom-in-90
        "
                >
                    <DialogHeader className="flex flex-col items-center text-center">
                        <div className="p-3 bg-red-500/10 rounded-full mb-3 border border-red-500/20">
                            <AlertTriangle className="w-8 h-8 text-red-400 animate-pulse" />
                        </div>

                        <DialogTitle className="text-xl font-semibold text-red-400">
                            Leave Test?
                        </DialogTitle>

                        <DialogDescription className="text-gray-300 mt-2 text-[15px] leading-relaxed">
                            You are currently taking the mock test. Leaving, refreshing, or pressing back will
                            <span className="text-red-300 font-medium"> auto-submit </span> your answers and end your session.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                            Stay on Test
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="bg-gradient-to-r from-red-500 via-pink-600 to-purple-700 hover:opacity-90 text-white px-5 rounded-lg"
                        >
                            Exit & Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
