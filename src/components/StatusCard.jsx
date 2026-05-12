import { motion } from "framer-motion";

export default function StatusCard({
  title,
  value,
  color,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg"
    >
      <h3 className="text-slate-400 text-sm mb-3">
        {title}
      </h3>

      <p className={`text-4xl font-bold ${color}`}>
        {value}
      </p>
    </motion.div>
  );
}