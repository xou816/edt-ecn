import React from "react";
import {virtualize} from "react-swipeable-views-utils";
import SwipeableViews from "react-swipeable-views";
import {Timetable} from "./Timetable";
import {addDays, isWeekend, startOfISOWeek} from "date-fns";
import EventList from "./EventList";
import timeviewAware, {View} from "./timeviewAware";

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

@timeviewAware
export default class extends React.Component {

    constructor(props) {
        super(props);
        this.slideRenderer = this.slideRenderer.bind(this);
        this.onChangeIndex = this.onChangeIndex.bind(this);
    }

    get index() {
        let {position, date} = this.props;
        return position(date);
    }

    onChangeIndex(newIndex) {
        let {atPosition, navigateTo} = this.props;
        let newDate = atPosition(newIndex);
        if (isWeekend(newDate)) {
            navigateTo(addDays(startOfISOWeek(newDate), (newIndex - this.index) > 0 ? 7 : 4));
        } else {
            navigateTo(newDate);
        }
    }

    slideRenderer({key, index}) {
        let {view, atPosition, position, date} = this.props;
        const diff = Math.abs(index - this.index);
        const component = (view & View.TIMETABLE) > 0 ? Timetable : EventList;
        date = position(date) === index ? date : atPosition(index);
        const props = {
            active: diff === 0,
            mobile: (view & View.MOBILE) > 0,
            currDate: diff === 0 ? date : null,
            renderDate: date,
            key: key
        };
        return diff < 3 ?
            React.createElement(component, props) :
            <div key={key}/>;
    }

    render() {
        let {view} = this.props;
        let preRender = (view & (View.MOBILE | View.TIMETABLE)) > 0 ? 2 : 1;
        return (
            <VirtualizeSwipeableViews overscanSlideAfter={preRender}
                                      overscanSlideBefore={preRender}
                                      onChangeIndex={this.onChangeIndex}
                                      index={this.index}
                                      style={{flexGrow: 1}}
                                      containerStyle={{height: '100%'}}
                                      slideStyle={{flexGrow: 1}}
                                      hysteresis={0.1}
                                      threshold={Infinity}
                                      enableMouseEvents
                                      slideRenderer={this.slideRenderer}/>
        );
    }
}