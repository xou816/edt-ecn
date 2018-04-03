const COLORS = {
    color1: 'rgba(240, 100, 73, 1)',
    color2: 'rgba(237, 230, 227, 1)',
    color3: 'rgba(218, 218, 217, 1)',
    color4: 'rgba(54, 56, 46, 1)',
    color5: 'rgba(91, 195, 235, 1)',
    color6: 'rgba(240, 135, 0, 1)',
    color7: 'rgba(244, 159, 10, 1)',
    color8: 'rgba(239, 202, 8, 1)',
    color9: 'rgba(0, 166, 166, 1)',
    color0: 'rgba(187, 222, 240, 1)'
};

export const COLOR_CLASSES = Object.keys(COLORS)
    .reduce((classes, key) => ({
        ...classes, [key]: {
            backgroundColor: `${COLORS[key]} !important`,
            color: 'white !important'
        }
    }), {});