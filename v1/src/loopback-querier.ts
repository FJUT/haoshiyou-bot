import {HsyListing} from "../loopbacksdk/models/HsyListing";
import {HsyUser} from "../loopbacksdk/models/HsyUser";
import {HsyGroupEnum} from './model';
const config = {
  "loopback": {
    "http://haoshiyou-server-prod.herokuapp.com": {
      "__domain": {
        "auth": {
          "auth": {"bearer": "[0]"}
        }
      },
      "api/{endpoint}": {
        "__path": {
          "alias": "__default",
        }
      }
    }
  },
};
const request = require('request');
const promise = require('bluebird');
const purest = require('purest')({request, promise});
const loopback = purest({provider: 'loopback', config});
// request.debug = true;
export class LoopbackQuerier {
  public async getHsyListingByUid(uid:string):Promise<HsyListing> {
    let req = loopback
        .get('HsyListings')
        .qs({filter:
            JSON.stringify({ 'where':
              {'uid': uid}
            })
        })
        .request();
    let result = await req
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    return result[0].body[0];
  }
  public async getLatestSomeHsyListing(hsyGroupEnum:HsyGroupEnum, limit:number = 10):Promise<HsyListing[]> {
    let req = loopback
        .get('HsyListings')
        .qs({filter:
            JSON.stringify({
              where: {
                hsyGroupEnum: HsyGroupEnum[hsyGroupEnum]
              },
              order: 'lastUpdated DESC',
              limit: limit,
            })
        })
        .request();

    let result = await req
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    return result[0].body;
  }

  public async setHsyListing(listing) {
    let req = loopback.put('HsyListings')
        .json(listing)
        .request();

    let result = await req
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    let listings:HsyListing[] = result[0].body;
    return listings.length > 0 ? listing[0] : null;
  }

  public async getHsyUserByUid(uid:string):Promise<HsyUser> {
    let req = loopback
        .get('HsyUsers')
        .qs({filter:
            JSON.stringify({ 'where':
                {'id': uid}
            })
        })
        .request();
    let result = await req
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    let hsyUsers:HsyUser[] = result[0].body;
    return hsyUsers.length > 0 ? hsyUsers[0]: null;
  }

  public async setHsyUser(user) {
    let req = loopback.put('HsyUsers')
        .json(user)
        .request();

    let result = await req
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    let users:HsyUser[] = result[0].body;
    console.log(JSON.stringify(users));
    return result;
  }

  public async updateHsyUserAttribute(userId, kv:object) {
    let req = loopback.put(`HsyUsers/${userId}`)
        .json(kv)
        .request();

    let result = await req
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    let users:HsyUser[] = result[0].body;
    console.log(JSON.stringify(users));
    return result;
  }
}
