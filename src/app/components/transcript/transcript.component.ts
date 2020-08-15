import { Component, OnInit } from '@angular/core';
import { TranscriptConstants } from 'src/app/constants/transcript-constants';
import { TranscriptService } from 'src/app/services/transcript.service';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnInit {

  transConstant: any;
  agentData = [];
  type = [];
  callType = [];
  filteredCallType = [];
  transcript = [];
  selectedAgent;
  selectedType;
  selectedCall;
  sensitivity = 0;
  selectedTranscript = [];
  realMatch = 0;
  expectedMatch = 0;
  real = [];
  expected = [];
  agentName: string;
  customerName: string;
  agentChannel: number;
  customerChannel: number;
  darkHighLightScript: number;
  darkHighlightTranscript: number;
  constructor(private transcriptService: TranscriptService) {
    this.transConstant = TranscriptConstants;
    this.agentData = this.transcriptService.agentData;
    this.type = this.transcriptService.type;
    this.callType = this.transcriptService.callTypes;
    this.transcript = this.transcriptService.transcriptData;
    this.agentName = '';
    this.customerName = '';
    this.darkHighLightScript = -1;
    this.darkHighlightTranscript = -1;
   }

   displayedColumns: string[] = ['similarity', 'channel', 'sentence'];
   scriptDisplayedColumns: string[] = ['order', 'similarity', 'sentence'];
  ngOnInit(): void {
    this.selectedType = this.type[0];
  }

  agentChanged() {
    this.selectedTranscript = [];
    this.selectedType = '';
    this.filteredCallType = [];
  }
  typeChanged() {
    this.filteredCallType = [];
    if (this.selectedType === '1') {
      this.callType.forEach((call) => {
        const agentIndex = call.agent.findIndex(x => x.agent_id === this.selectedAgent);
        if (agentIndex > -1) {
          this.filteredCallType.push( {
            agent_id: call.agent[agentIndex].agent_id,
            agent_channel_no: call.agent[agentIndex].channel_no,
            customer_name: call.customer[agentIndex].full_name,
            customer_channel_no: call.customer[agentIndex].channel_no,
            customer_display_name: call.call_start_time.split(' ')[0].split('-').reverse().join('.')
             + '. - ' + call.customer[agentIndex].full_name,
          });
        }
      });
    } else {

        const index = this.callType.findIndex(x => x.calltype_id === this.selectedType);
        if (index > -1) {
          const call = this.callType[index];
          this.filteredCallType.push( {
            agent_id: call.agent[index].agent_id,
            agent_channel_no: call.agent[index].channel_no,
            customer_name: call.customer[index].full_name,
            customer_channel_no: call.customer[index].channel_no,
            customer_display_name: call.call_start_time.split(' ')[0].split('-').reverse().join('.')
             + '. - ' + call.customer[index].full_name,
          });
        }
    }

    if (this.filteredCallType.length === 0) {
      this.selectedTranscript = [];
    }

  }

  callChanged() {
    this.selectedTranscript = [];
    if (this.filteredCallType.length > 0) {
      const index = this.transcript.findIndex(x => x.agent.findIndex(y => y.agent_id === this.filteredCallType[0].agent_id));
      if (index > -1 ) {
        this.selectedTranscript.push(this.transcript[index]);
       }
    }
    if (this.selectedTranscript.length > 0) {
      this.getDisplayNames();
      this.sensitivity = 38;
      this.calculateSensitivity();
    } else {
      this.sensitivity = 0;
      this.calculateSensitivity();
    }
  }
  calculateSensitivity() {
    this.real = [];
    this.expected = [];
    const filteredTranscript = this.selectedTranscript[0].transcript.filter(x => x.similarity >= (this.sensitivity / 100)).length;
    this.realMatch = (filteredTranscript / this.selectedTranscript[0].transcript.length) * 100;
    this.realMatch = Math.floor(this.realMatch);
    this.real.push(100 - this.realMatch);
    this.real.push(this.realMatch);
    const filteredScript = this.selectedTranscript[0].script.filter(x => x.similarity >= (this.sensitivity / 100)).length;
    this.expectedMatch = (filteredScript / this.selectedTranscript[0].script.length) * 100;
    this.expectedMatch = Math.floor(this.expectedMatch);
    this.expected.push(100 - this.expectedMatch);
    this.expected.push(this.expectedMatch);
  }

  getDisplayNames() {
    this.agentName = this.agentData.filter(x => x.agent_id === this.filteredCallType[0].agent_id)[0].full_name;
    this.agentName = this.agentName.split(' ')[0];
    this.customerName = this.filteredCallType[0].customer_name;
    this.customerName = this.customerName.split(' ')[0] ;
    this.agentChannel = this.filteredCallType[0].agent_channel_no;
    this.customerChannel = this.filteredCallType[0].customer_channel_no;
  }

  selections(index) {
    if (this.selectedTranscript[0].transcript[index].similarity >= (this.sensitivity / 100)) {
      if (this.selectedTranscript[0].transcript[index].sentence && this.selectedTranscript[0].transcript[index].matching_sentence) {
      let output = (this.selectedTranscript[0].transcript[index].similarity * 100) + '';
      output += '% matching with line #';
      const scriptIndex = this.selectedTranscript[0].script.findIndex(x => x.similarity === this.selectedTranscript[0].transcript[index].similarity);
      if (scriptIndex > -1) {
        output += ( this.selectedTranscript[0].script[scriptIndex].order + 1);
        output += ' ';
        output += this.selectedTranscript[0].script[scriptIndex].sentence;
        return output;
      }
      }
    }
    return '';
  }

  handleMouseOver(row) {
    if (row.sentence && row.matching_sentence && (row.similarity * 100) >= this.sensitivity) {
      if (this.selectedTranscript[0].transcript[row.order].similarity >= (this.sensitivity / 100)) {
        if (this.selectedTranscript[0].transcript[row.order].sentence &&
          this.selectedTranscript[0].transcript[row.order].matching_sentence) {
        const scriptIndex = this.selectedTranscript[0].script.findIndex(x => x.similarity === 
          this.selectedTranscript[0].transcript[row.order].similarity);
        if (scriptIndex > -1) {
        this.darkHighlightTranscript = this.selectedTranscript[0].transcript[row.order].order;
        this.darkHighLightScript = this.selectedTranscript[0].script[scriptIndex].order;
        }
      }
    }
  }
  }
  handleMouseLeave(row) {
    this.darkHighLightScript = -1;
    this.darkHighlightTranscript = -1;
  }

}
