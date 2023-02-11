// eslint-disable-next-line import/no-commonjs
const path = require("path");

const outputRootDir = {
  weapp: "dist",
  alipay: "dist-alipay",
};

const config = {
  projectName: "noNeed2Choose",
  date: "2021-9-11",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: outputRootDir[process.env.TARO_ENV] || "dist",
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: "react",
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  alias: {
    "@/constants": path.resolve(__dirname, "..", "src/constants"),
    "@/model": path.resolve(__dirname, "..", "src/model"),
    "@/utils": path.resolve(__dirname, "..", "src/utils"),
    "@/pages": path.resolve(__dirname, "..", "src/pages"),
    "@/assets": path.resolve(__dirname, "..", "src/assets"),
    "@/db": path.resolve(__dirname, "..", "src/db"),
    "@/theme": path.resolve(__dirname, "..", "src/app.less"),
    "@/services": path.resolve(__dirname, "..", "src/services"),
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
