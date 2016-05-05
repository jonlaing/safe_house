# SafeHouse
--------------------------------------------------------------------------------

## Mission

The developers of SafeHouse firmly believe that the enforcment of borders only furthers to isolate us as humans and limit our freedom and self-determination. We believe the witch hunts against "illegal immigrants" and "refugees" to be abominable and agencies that enforce borders to be wholly illegitimate. It is with these beliefs that we have developed SafeHouse in an attempt to mitigate the tyranny imposed by borders upon the poor and desparate of the world.

## Goal

SafeHouse is designed with the intent of using technology to facilitate an "underground railroad" of sorts; linking those in need, with those who wish to help. It is intended to be an easy and relatively safe way to seek and lend solidarity with immigrants and refugees.

## How It Works

### For those that are looking for housing

Getting set up with SafeHouse is easy! The signup process only requires you to enter a username (does not have to be your real name), and how many people you need to house and for how long. From there, the app will match you with housing in the area based on the Geolocation on your phone. From there you can request to chat with people who are offering housing to make arrangements. The chats are Peer-to-Peer encrypted, so no one but the two parties involved can see the messages.

### For those that are offering housing

Offering housing with SafeHouse is simple. We **do not** require you to provide your address! All that you need to to tell us is your postal code, how many people you can house and for how long. Using your postal code, we determine an *approximate* location for your home, so that those in need can find you, and see approximately how far away you are. Those looking for housing will request to contact you, and from there you can set up an encrypted chat to make arrangements. The chats are Peer-to-Peer encrypted, so no one but the two parties involved can see the messages.


## Get Involved

SafeHouse is still in active development, but there are many ways to get involved! Here are some skills that we need:

- **Translators:** Being that this problem is global, we need to represent as many languages as possible. If you fluently speak a language other than English, get in touch! We may need your help.
- **Developers:** Obviously, SafeHouse can always use more help on the tech front. It is an opensource project, so anyone is free to contribute. The backend is written in [Golang](http://golang.org) and the App itself is written with [React Native](https://facebook.github.io/react-native/). Scroll down to see instructions on how to contribute.
- **IT People:** Getting all the moving parts to work nicely is a big challenge. If you have any expertise to offer in setting up Ops, get in touch!
- **Security People:** The people who use SafeHouse might be under the scrutiny of various agencies and other malefactors. We need to keep our security airtight for our users' safety. If this is your thing, please contact us.
- **Donations:** We don't have a way to donate set up quite yet, but we will be needing to pay for server space and other operational costs. We'll be doing this out-of-pocket initially, but it would be nice if the project financed itself.


--------------------------------------------------------------------------------

## Development

This repository is a mix of [Golang](http://golang.org) and [ReactNative](https://facebook.github.io/react-native/). To get set up, you'll need a few things. First, if you're not setup with Golang, follow the installation instructions [here.](https://golang.org/dl/)

After that, clone the project onto your local machine:

```
git clone https://github.com/jonlaing/safe_house.git && cd safe_house
```

### Server

Next, you'll need [Godep](https://github.com/tools/godep) for dependency management for the server:

```
go get github.com/tools/godep
```

Install the dependencies for the server by using the following:

```
godep go install ./...
```

Next, I generally start the server by running:

```
godep go install ./... && safe_house
```

### App

I should note that SafeHouse currently only works for iOS, but this is an issue we hope to fix *very* shortly. For now, to get set up with the ReactNative project, navigate to the App directory with:

```
cd ./SafeHouseApp
```

You'll need to get the node dependencies. You can do so by running:

```
npm install
```

From there, you can open `safe_house/SafeHouseApp/ios/SafeHouseApp.xcodeproj` in Xcode and run it in the simulator. Make sure the server is running, or nothing will work!

To work on the app, most of the React Native components are located in `safe_house/SafeHouseApp/app`.
