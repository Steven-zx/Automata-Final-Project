## Custom Fonts Used in Stack Rollercoaster Project

### Font List
1. **Font Name:** [Font Name 1]
   - **Style:** Regular
   - **Weight:** 400
   - **License:** [License Type]
   - **Usage:** Used for headings and titles.

2. **Font Name:** [Font Name 2]
   - **Style:** Bold
   - **Weight:** 700
   - **License:** [License Type]
   - **Usage:** Used for buttons and important messages.

### Including Fonts
To include the custom fonts in your project, add the following lines to your CSS files:

```css
@font-face {
    font-family: 'Font Name 1';
    src: url('../assets/fonts/font-name-1.woff2') format('woff2'),
         url('../assets/fonts/font-name-1.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'Font Name 2';
    src: url('../assets/fonts/font-name-2.woff2') format('woff2'),
         url('../assets/fonts/font-name-2.woff') format('woff');
    font-weight: 700;
    font-style: normal;
}
```

### License Information
Ensure to comply with the licensing terms of the fonts used in this project. Check the respective font websites for more details on usage rights and restrictions.