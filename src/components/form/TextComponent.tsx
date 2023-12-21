import { AppEvents, PanelData } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { fetchKafka } from 'utils/fetchKafka';
import DeleteIcon from '../../img/delete.svg';
import LinkOffIcon from '../../img/link-off.svg';
import LinkIcon from '../../img/link.svg';
import SendIcon from '../../img/send.svg';
import './TextComponent.css';
/**
 * Input textArea json and fetch json to Kafka
 * Alain Witkowski
 */
type Props = {
  rows: string;
  data: PanelData;
};

type PluginBackendResult = {
  duration: number;
  status: number;
}

const kafkaPluginName = 'csgroup-grafanadatasourcekafka-datasource';

let checkInput = false;

let busy = false;
export const TextComponent: React.FC<Props> = ({ rows, data }) => {
  const updatedRows = (): string => {
    return checkInput ? postData : rows;
  };
  const [postData, setPost] = useState(updatedRows);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    checkInput = true;

    setPost(event.target.value);
  };

  const deleteAll = () => {
    setPost('');
    checkInput = false;
  };
  const fetchJson = () => {
    // console.log(data.request);
    let appEvents = getAppEvents();

    if(busy){
      appEvents.publish({
        type: AppEvents.alertError.name,
        payload: ["Request in progress, please wait"],
      });
    }
    busy = true
    fetchKafka(kafkaPluginName,(err: Error | null, data: PluginBackendResult | null) => {
      busy = false

      if(err!=null){
        appEvents.publish({
          type: AppEvents.alertError.name,
          payload: [err],
        });
        return
      }

      if(data===null){
        appEvents.publish({
          type: AppEvents.alertError.name,
          payload: ["Backend datasource respnse is empty"],
        });
        return
      }

      if(data.status===0){
        appEvents.publish({
          type: AppEvents.alertError.name,
          payload: ["Kafka send acknoledge timeout"],
        });
        return
      }
      
      appEvents.publish({
        type: AppEvents.alertSuccess.name,
        payload: ["Sent on Kafka, ack after "+data.duration+"ms"],
      });

    },postData);
  };
 

  useEffect(() => {
    if (checkInput) {
      setPost(postData);
    } else {
      setPost(rows);
    }
  }, [postData, rows]);
  return (
    <>
      <div className="row-text">
        <header>
          <h3>
            json content{' '}
            {checkInput ? (
              <span className="alert-unlink" title="unlinked to form">
                {/* <LinkOffIcon /> */}
                <img className="icon" src={LinkOffIcon} alt='unlink from list'/> 
                
          
              </span>
            ) : (
              <span title="link to form">
                  {/* <LinkIcon /> */}
                  <img className="icon" src={LinkIcon} alt='link to list'/> 
                 
               
              </span>
            )}
          </h3>
        </header>
        <textarea
          placeholder=" ...past json"
          rows={10}
          cols={33}
          name="json"
          id=""
          value={postData}
          role="textarea"
          onChange={(e) => handleChange(e)}
        ></textarea>
        <div className="row">
          <button className="btn deleteBtn" role="button" name="delete" onClick={deleteAll} title="delete">
            {/* <DeleteIcon /> */}
            <img className="icon" src={DeleteIcon} alt='delete json'/> 
           delete
          </button>
          <button className="btn sendBtn" role="button" name="fetchJson" onClick={fetchJson}>
            {/* send Json <SendIcon /> */}
            <img className="icon" src={SendIcon} alt='send to kafka'/> 
            send Json
          </button>
        </div>
      </div>
    </>
  );
};
