module.exports = {
    "env": {
        "browser": true
    },
    "extends": [
      "airbnb-base",
      "eslint:recommended",
    ],
    "parserOptions": {
        "ecmaVersion": 10,
        "sourceType": "module"
    },
    "ignorePatterns": ["build/*"],
    "rules": {
      "no-tabs": 0,
      "semi": [2, "always"],
      "func-names": "off", // 閉關匿名函式會報錯的規則
      "no-unused-vars": "warn", // 把no-unused-vars相關的錯誤以警告顯示
      "no-console": "warn", // 閉關使用console.log會跳警告的規則
      "eol-last": 0,
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          "js": "always",
        }
     ]
    }
};
