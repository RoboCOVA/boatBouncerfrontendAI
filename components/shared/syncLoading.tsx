import { Box, CircularProgress } from "@mui/material";
import { CircularProgressProps } from "@mui/material";

export default function SyncLoading(props: CircularProgressProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex w-full items-center justify-center bg-black opacity-40">
      <Box sx={{ display: "flex" }}>
        <CircularProgress {...props} />
      </Box>
    </div>
  );
}
