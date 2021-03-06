import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const palette = {/*
    primary: {
        main: '#444444' //#122542
    },
    secondary: {
        main: '#f9ae0c'
    },
    type: 'dark'
*/};

export const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette
});

export const COLORS = {
    color1: '#345995',
    color2: '#D81159',
    color3: '#FFBC42',
    color4: '#0496FF',
    color5: '#FF9F1C',
    color6: '#68A357',
    color7: '#C45BAA',
    color8: '#C17C74',
    color9: '#7A6563',
    color0: '#662E9B'
};


export const COLOR_CLASSES = Object.keys(COLORS)
    .reduce((classes, key) => ({
        ...classes, [key]: {
            backgroundColor: `${COLORS[key]} !important`,
            color: 'white !important'
        }
    }), {});