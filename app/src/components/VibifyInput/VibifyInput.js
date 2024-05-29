import Flexbox from 'flexbox-react';
export default function VibifyInput(props){
    return (
        <Flexbox flexDirection="row" minWidth="100vh" justifyContent="center">
            <div>
                <input
                placeholder={props.placeholder}
                type={props.type}
                size={props.size}
                value={props.value}
                onChange={props.onChange}
                />
            </div>
            <p>{props.text}</p>
        </Flexbox>
    );
}
