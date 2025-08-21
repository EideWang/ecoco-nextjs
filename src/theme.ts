import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FD4F00", // 主色
      contrastText: "#fff",
    },
    secondary: {
      main: "#FFCE00", // 副色
      contrastText: "#222",
    },
    info: {
      main: "#0F0E9F", // 強調色
      contrastText: "#fff",
    },
    background: {
      default: "#f3f4f6", // APP背景色
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          // 加上這一行可以防止內容超出視窗寬度時出現水平滾動條
          // 但請注意，如果真的有需要水平滾動的內容，這會隱藏它
          // overflowX: 'hidden',
        },
        html: {
          // 確保 html 元素也沒有任何外邊距
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FD4F00",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#FD4F00",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FD4F00",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#FD4F00",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
        contained: {
          backgroundColor: "#FD4F00",
          color: "#fff",
        },
        containedSecondary: {
          backgroundColor: "#FFCE00",
          color: "#222",
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          minHeight: 56, // mobile 預設
          "@media (min-width:600px)": {
            minHeight: 64, // PC
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 56, // mobile 預設
          "@media (min-width:600px)": {
            minHeight: 64, // PC
          },
        },
      },
    },
  },
  typography: {
    fontFamily: [
      "Noto Sans TC",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

export default theme;
