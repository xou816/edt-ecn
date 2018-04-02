import React from "react";
import {Button, Checkbox, Divider, Drawer, List, ListItem, ListItemText, ListSubheader} from "material-ui";
import {connect} from "react-redux";
import {finishSelection, getCalendar, toggleCalendar, toggleMenu} from "../app/actions";

const mapState = state => ({
    list: state.app.list,
    show: state.app.menu,
    selection: state.app.selection
});

const mapDispatch = dispatch => ({
    hide: () => {
        dispatch(finishSelection());
        dispatch(toggleMenu());
        dispatch(getCalendar());
    },
    toggle: id => () => dispatch(toggleCalendar(id))
});

@connect(mapState, mapDispatch)
export class Sidebar extends React.Component {

    render() {
        return (
            <Drawer open={this.props.show} onClose={this.props.hide}>
                <Divider/>
                <List component="nav" subheader={(
                    <ListSubheader component="div" style={{display: 'flex'}}>
                        <span style={{flexGrow: 1}}>{this.props.selection.length} calendrier(s) sélectionnés</span>
                        <Button onClick={this.props.hide} color="primary">
                            Fermer
                        </Button>
                    </ListSubheader>
                )}>
                    {
                        this.props.list.map(calendar => (
                            <ListItem key={calendar.id} button onClick={this.props.toggle(calendar.id)}>
                                <Checkbox checked={this.props.selection.indexOf(calendar.id) > -1} tabIndex={-1} disableRipple />
                                <ListItemText primary={calendar.display}/>
                            </ListItem>
                        ))
                    }
                </List>
            </Drawer>
        );
    }

}