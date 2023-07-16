import { APP_BASE_HREF } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit{

  constructor(private router: Router, @Inject(APP_BASE_HREF) public baseHref: string) {}
  customerCode = '12345678';
  canViewNextBestOffer = true;
  isLoading = false;
  apiErrors = [];
  campaignsWithMessages = [];
  isSiebelOffline = false;
  campaigns = [];
  campaignsV2 = [
    {
        customerCode: '1257484001',
        product: 'Product3',
        campaignId: '2-33NNKK',
        campaignType: 'Type3',
        parentActionName: 'ΕΛΛΗΝΙΚΑ ΜΕ ΚΕΝΟ',
        campaignDescription: 'Campaign3Desc',
        campaignLaunchDate: '2020-03-01T09:47:03.270Z',
        campaignEndDate: '2099-03-18T09:47:03.270Z',
        offerId: '1',
        offerName: 'Offer3',
        offerDescription: 'Offer2Desc',
        treatmentId: '2-00JJFF',
        treatmentName: 'Treatment2',
        treatmentDescription: 'Treatment2Desc',
        actionListStatus: 'Αρνητικός',
        responseDate: '2020-03-01T09:47:03.270Z',
        responseMethod: '2020-03-01T09:47:03.270Z',
        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],
        warningFlag: true,
        warningMessage: 'this is a vary large text this is a vary large textthis is a vary large textthis is a vary large textthis is a vary large text'
      },
      {
        campaignDescription: 'Campaign2Desc',
        campaignEndDate: '2015-03-14T09:47:03.270Z',
        campaignId: '2-33NNKK',
        campaignLaunchDate: '2020-03-01T09:47:03.270Z',
        parentActionName: 'ΣΑΛΑΛΑ - ΦΑ',
        campaignType: 'Type3',
        customerCode: '1257484001',
        offerDescription: 'Offer2Desc',
        offerId: '1',
        offerName: 'Offer2',
        product: 'Product2',
        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],
        treatmentDescription: 'Treatment2Desc',
        treatmentId: '2-00JJFF',
        treatmentName: 'Treatment2',
        warningFlag: false,
        warningMessage: null,
        responseDate: '',
        responseMethod: '',
        actionListStatus: 'Επιθυμώ Ενημέρωση'
      },
      {
        campaignDescription: 'Campaign2Desc',
        campaignEndDate: '2021-03-18T09:47:03.270Z',
        campaignId: '2-33NNKK',
        campaignLaunchDate: '2020-03-01T09:47:03.270Z',
        parentActionName: ' Τest Camp III - nοt ΞΕΝΟ ΑΦΜ',
        campaignType: 'Type3',
        customerCode: '1257484001',
        offerDescription: 'Offer2Desc',
        offerId: '1',
        offerName: 'Offer2',
        product: 'Product2',
        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],
        treatmentDescription: 'Treatment2Desc',
        treatmentId: '2-00JJFF',
        treatmentName: 'Treatment2',
        warningFlag: false,
        warningMessage: null,
        responseDate: '',
        responseMethod: '',
        actionListStatus: 'Επιθυμώ Ενημέρωση'
      },
      {
        customerCode: '1257484001',
        product: 'Product3',
        campaignId: '2-33NNKK',

        campaignType: 'Type3',

        parentActionName: 'ΕΛΛΗΝΙΚΑ',

        campaignDescription: 'Campaign3Desc',

        campaignLaunchDate: '2020-03-01T09:47:03.270Z',

        campaignEndDate: '2099-03-18T09:47:03.270Z',

        offerId: '1',

        offerName: 'Offer3',

        offerDescription: 'Offer2Desc',

        treatmentId: '2-00JJFF',

        treatmentName: 'Treatment2',

        treatmentDescription: 'Treatment2Desc',

        actionListStatus: 'Θετικός',

        responseDate: '2020-03-01T09:47:03.270Z',

        responseMethod: '2020-03-01T09:47:03.270Z',

        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],

        warningFlag: true,

        warningMessage: 'other tooltip'

      },

      {

        customerCode: '1257484001',

        product: 'Product3',

        campaignId: '2-33NNKK',

        campaignType: 'Type3',

        parentActionName: 'Campaign3',

        campaignDescription: 'Campaign3Desc',

        campaignLaunchDate: '2020-03-01T09:47:03.270Z',

        campaignEndDate: '2033-01-10T09:47:03.270Z',

        offerId: '1',

        offerName: 'Offer3',

        offerDescription: 'Offer2Desc',

        treatmentId: '2-00JJFF',

        treatmentName: 'Treatment2',

        treatmentDescription: 'Treatment2Desc',

        actionListStatus: 'Θετικός',

        responseDate: '2020-03-01T09:47:03.270Z',

        responseMethod: '2020-03-01T09:47:03.270Z',

        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],

        warningFlag: true,

        warningMessage: 'more'

      },

      {
        campaignDescription: 'Campaign2Desc',
        campaignEndDate: '2033-01-18T09:47:03.270Z',
        campaignId: '2-33NNKK',
        campaignLaunchDate: '2020-03-01T09:47:03.270Z',
        parentActionName: 'Campaign2',
        campaignType: 'Type3',
        customerCode: '1257484001',
        offerDescription: 'Offer2Desc',
        offerId: '1',
        offerName: 'Offer2',
        product: 'Product2',
        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],
        treatmentDescription: 'Treatment2Desc',
        treatmentId: '2-00JJFF',
        treatmentName: 'Treatment2',
        warningFlag: false,
        warningMessage: 'Message3',
        responseDate: '',
        responseMethod: '',
        actionListStatus: 'Αρνητικός'
      },

      {
        campaignDescription: 'Campaign2Desc',
        campaignEndDate: '2033-05-18T09:47:03.270Z',
        campaignId: '2-33NNKK',
        campaignLaunchDate: '2020-03-01T09:47:03.270Z',
        parentActionName: 'Campaign2',
        campaignType: 'Type3',
        customerCode: '1257484001',
        offerDescription: 'Offer2Desc',
        offerId: '1',
        offerName: 'Offer2',
        product: 'Product2',
        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],
        treatmentDescription: 'Treatment2Desc',
        treatmentId: '2-00JJFF',
        treatmentName: 'Treatment2',
        warningFlag: false,
        warningMessage: 'Message3',
        responseDate: '',
        responseMethod: '',
        actionListStatus: 'Θετικός'
      },

      {
        customerCode: '1257484001',
        product: 'Product3',
        campaignId: '2-33NNKK',
        campaignType: 'Type3',
        parentActionName: 'Τest Camp III - nοt ΞΕΝΟ ΑΦΜ   ',
        campaignDescription: 'Campaign3Desc',
        campaignLaunchDate: '2020-03-01T09:47:03.270Z',
        campaignEndDate: '2020-05-18T09:47:03.270Z',
        offerId: '1',
        offerName: 'Offer3',
        offerDescription: 'Offer2Desc',
        treatmentId: '2-00JJFF',
        treatmentName: 'Treatment2',
        treatmentDescription: 'Treatment2Desc',
        actionListStatus: 'Σε εκκρεμότητα',
        responseDate: '2020-03-01T09:47:03.270Z',
        responseMethod: '2020-03-01T09:47:03.270Z',
        responseTypes: [{type: 'Επιθυμώ Ενημέρωση', parent: null, name: 'Name2', value: 'Value2', subTypes: []}],
        warningFlag: true,
        warningMessage: 'Message3'
      }
     ].sort((a,b) => {
      return new Date(b.campaignEndDate).getTime() - new Date(a.campaignEndDate).getTime()
    }).map(item => ({...item,
      parentActionName: item.parentActionName.trim()}));

    ngOnInit() {
      console.log(this.campaignsV2);
    }

    onCampaignClick(campaign) {
      const base = this.baseHref.endsWith('/') ? this.baseHref.slice(0, -1) : this.baseHref;
      const url = this.router.createUrlTree([`${base}/playground/outbound/${campaign.parentActionName.trim()}/${this.customerCode}`]);
      window.open(url.toString(), '_blank');
    }
}
