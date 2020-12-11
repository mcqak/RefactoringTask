const WebBrowser = {
  BrowserName: {
    Unknown: 'Unknown',
    InternetExplorer: 'InternetExplorer',
    Firefox: 'Firefox',
    Chrome: 'Chrome',
    Opera: 'Opera',
    Safari: 'Safari',
    Dolphin: 'Dolphin',
    Konqueror: 'Konqueror',
    Linx: 'Linx',
  },
};

function Speaker() {

  let SpeakerContext = this;

  SpeakerContext.validate = () => {
    //We're now requiring 3 certificatons so I changes the hard coded number
    const employersList = ['Microsoft', 'Google', 'Fog Creek Software', '37Signals'];
    return (SpeakerContext.exp > 10 ||
    SpeakerContext.hasBlog ||
    SpeakerContext.certifications.length > 3 ||
    employersList.indexOf(SpeakerContext.employer) !== -1);
  }

  SpeakerContext.checkValidation = () => {
    //DEFECT #5274 weren't filtering out prodigy domain so I added it.
    const domainsList = ['aol.com', 'hotmail.com', 'prodigy.com', 'CompuServe.com'];
    const emailParts = SpeakerContext.email.split('@');
    const emailDomain = emailParts[emailParts.length - 1];
    return (domainsList.indexOf(emailDomain) === -1 &&
    !(SpeakerContext.browser.name == WebBrowser.BrowserName.InternetExplorer &&
        SpeakerContext.browser.majorVersion < 9))
  }

  SpeakerContext.setApprovement = () => {
    const technologiesList = ['Cobol', 'Punch Cards', 'Commodore', 'VBScript'];
    for (let session of SpeakerContext.sessions) {
      for (let technology of technologiesList) {
        return session.approved = (session.title.indexOf(technology) !== -1 ||
        session.description.indexOf(technology) !== -1) ? false : true;
      }
    }
  }

  SpeakerContext.checkSessions = () => {
    //DEFECT #5013 CO 1/12/2012
    //We weren't requiring at least one session
    if (SpeakerContext.sessions.length !== 0) {
              return SpeakerContext.setApprovement();
            } else {
              throw new Error(
                "Can't register speaker with no sessions to present."
              );
            }
  }

  SpeakerContext.setRegistrationFee = () => {
    //if we got this far, the speaker is approved
    //let's go ahead and register him/her now.
    //First, let's calculate the registration fee.
    //More experienced speakers pay a lower fee.
    const experiense = SpeakerContext.exp;
    if (experiense <= 1) {
      return 500;
    } else if (experiense >= 2 && experiense <= 3) {
      return 250;
    } else if (experiense >= 4 && experiense <= 5) {
      return 100;
    } else if (experiense >= 6 && experiense <= 9) {
      return 50;
    } else return 0;
  }

  SpeakerContext.setSpeakerId = (isSpeakerApproved, speakerId, isSpeakerValid, repository) => {
    if (isSpeakerValid) {
      isSpeakerApproved = SpeakerContext.checkSessions();

      if (isSpeakerApproved) {
        SpeakerContext.registrationFee = SpeakerContext.setRegistrationFee()
        //Now, save the speaker and sessions to the db.
        return speakerId = repository.saveSpeaker(this);
      } else {
        throw new Error('No sessions approved.');
      }
    } else {
      throw new Error("Speaker doesn't meet our abitrary and capricious standards.");
    }
  }

  SpeakerContext.speakerValid = (speakerId, isSpeakerApproved, repository) => {
    if (SpeakerContext.firstName && SpeakerContext.lastName && SpeakerContext.email) {
      let isSpeakerValid = SpeakerContext.validate();
      isSpeakerValid = !isSpeakerValid ? SpeakerContext.checkValidation() : isSpeakerValid;

        return speakerId = SpeakerContext.setSpeakerId(isSpeakerApproved, speakerId, isSpeakerValid, repository);
    } else {
      const error = SpeakerContext.email.length === 0 ? 'Email is required' : 
      SpeakerContext.lastName.length === 0 ? 'Last Name is required' : 
      SpeakerContext.firstName.length === 0 ? 'First Name is required' : null;
      throw new Error(error);
    }
  }


  //Register a speaker and return speakerID
  SpeakerContext.register = (repository) => {
    let speakerId = null;
    let isSpeakerApproved = false;

    speakerId = SpeakerContext.speakerValid(speakerId, isSpeakerApproved, repository);

    return speakerId;
  };
}

module.exports = {
  Speaker: Speaker,
  WebBrowser: WebBrowser,
};
