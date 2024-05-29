import Slider from 'rc-slider';
import Flexbox from 'flexbox-react';
export default function VibifySlider(props){
    return(
        <Flexbox flexDirection="row" minWidth="100vh" justifyContent="space-between">
            <div>
                <h4>{props.leftText}</h4>
            </div>

            <Flexbox flexGrow={0.5}>
                <Slider
                value={props.sliderVal}
                onChange={props.callback}
                max={props.max}
                />
            </Flexbox>
            <div>
                <h4>{props.rightText}</h4>
            </div>
        </Flexbox>
    );
}
