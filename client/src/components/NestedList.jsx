import {Checkbox, Collapse, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from "react";

export function NestedList({unfold, title, shown, nested, getId, toggle, checkbox, checked, getPrimary, getSecondary}) {
    const count = nested.reduce((count, el) => count + (checked(getId(el)) ? 1 : 0), 0);
    if (getSecondary == null) {
        getSecondary = () => null;
    }
    return (
        <React.Fragment>
            <ListItem onClick={unfold} button>
                <ListItemText primary={title} secondary={count > 0 ? `Sélectionnés : ${count}` : null}/>
                {shown ? <ExpandLess color="secondary"/> : <ExpandMore color="secondary"/>}
            </ListItem>
            <Collapse in={shown}>
                <List>
                    {nested.map(element => (
                        <ListItem key={getId(element)} onClick={() => toggle(getId(element))} button>
                            <Checkbox {...checkbox} checked={checked(getId(element))} tabIndex={-1}
                                      disableRipple/>
                            <ListItemText primary={getPrimary(element)} secondary={getSecondary(element)} />
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    );
}