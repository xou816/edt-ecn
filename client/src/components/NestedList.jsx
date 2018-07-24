import {Checkbox, Collapse, List, ListItem, ListItemText, ListItemIcon} from "@material-ui/core";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React from "react";

export function NestedList(props) {
    return (
        <React.Fragment>
            <ListItem onClick={props.unfold} button>
                <ListItemText primary={props.title}/>
                {props.shown ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={props.shown}>
                <List>
                    {props.nested.map(element => (
                        <ListItem key={props.getId(element)} onClick={() => props.toggle(props.getId(element))} button>
                            <Checkbox {...props.checkbox} checked={props.checked(props.getId(element))} tabIndex={-1} disableRipple/>
                            <ListItemText primary={props.getDisplay(element)}/>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    );
}