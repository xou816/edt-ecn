import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from "react";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Collapse from "@material-ui/core/Collapse/Collapse";
import List from "@material-ui/core/List/List";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";

export function NestedList({unfold, title, shown, nested, getId, toggle, checkbox, checked, getPrimary, getSecondary}) {
    const count = nested.reduce((count, el) => count + (checked(getId(el)) ? 1 : 0), 0);
    if (getSecondary == null) {
        getSecondary = () => null;
    }
    return (
        <React.Fragment>
            <ListItem onClick={unfold} button>
                <ListItemText primary={title} secondary={count > 0 ? `Sélection : ${count}` : null}/>
                {shown ? <ExpandLess color="secondary"/> : <ExpandMore color="secondary"/>}
            </ListItem>
            <Collapse in={shown}>
                <List>
                    {nested.map(element => shown && (
                        <ListItem key={getId(element)} onClick={() => toggle(getId(element))} button>
                            <Checkbox {...checkbox} checked={checked(getId(element))} tabIndex={-1}
                                      disableRipple/>
                            <ListItemText primary={getPrimary(element)} secondary={getSecondary(element)}/>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    );
}