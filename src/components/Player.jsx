import {useState} from "react";

const Player = ({name, symbol, isActive, onNameChnage}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [playerName, setPlayerName] = useState(name);
    const handleEditClick = () => {
        setIsEditing(editing => !editing);
        isEditing && onNameChnage(symbol, playerName);
    }
    const handleChange = event => setPlayerName(event.target.value)

    return (<li className={isActive ? "active" : ""}>
                <span className="player">
                    {isEditing ? <input type="text" value={playerName} onChange={handleChange}/> :
                        <span className="player-name">{playerName}</span>}
                    <span className="player-symbol">{symbol}</span>
                </span>
        <button onClick={handleEditClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>);
};

export default Player;