import express from 'express';
import Bluebird from 'bluebird';
import mongoose from 'mongoose';
import apiConstructor from './httpApi/constructor';
import v1api from './httpApi/v1';
import v2api from './httpApi/v2';
import * as models from './models';
import getGooglePlacesId from './externalApi/googlePlaces';

export function connectToMongo(mongoose, dbConnectionString){
    mongoose.connect(dbConnectionString);

    return new Bluebird((resolve, reject) => {
        const db = mongoose.connection;
        db.on('error', reject);
        db.once('open', resolve);
    });
}

async function addGooglePlacesId(boutique) {
    const Boutique = models.boutique;

    // Only update if no google_places_id is found
    if (!boutique.google_places_id || boutique.google_places_id === '-1') {
        const google_places_id = await getGooglePlacesId(boutique.name, boutique.location);

        if (!boutique.google_places_id) {
            boutique.google_places_id = google_places_id;
            return Boutique.findOneAndUpdate({slug: boutique.slug}, boutique, {new: true})
                            .then(() => 1) // to keep count of updated boutiques
                            .catch(() => 0);
        }

        if (google_places_id !== '-1') {
            boutique.google_places_id = google_places_id;
            return Boutique.findOneAndUpdate({slug: boutique.slug}, boutique, {new: true})
                            .then(() => 1) // to keep count of updated boutiques
                            .catch(() => 0);
        }
    }
    return 0; // to keep count of updated boutiques
}

function updateMongoModels() {
    const Boutique = models.boutique;

    Boutique.find({})
        .then(async boutiques => {
            // Using for-loop (instead of for-each) to maintain order of calls
            // New request to google API will only be done after entry is updated

            console.log('Attempting to update existing boutiques...');
            console.log('Boutiques to update: ' + boutiques.length);

            let updateCount = 0;
            for (let i = 0; i < boutiques.length; i++) {
                updateCount += await addGooglePlacesId(boutiques[i])
            }

            console.log('Boutiques actually updated: ' + updateCount);
        })
        .catch(err => new Error(err));
}

function initHttpApi(){
    return new Bluebird((resolve, reject) => {
        try {
            const routeConfig = [v1api, v2api];
            const api = apiConstructor(express, routeConfig);
            return resolve(api);
        } catch (err) {
            return reject(err);
        }
    });
}

export default function boot({mongoConnectionString}){
    return connectToMongo(mongoose, mongoConnectionString)
        .then(updateMongoModels)
        .then(initHttpApi)
        .then(api => {
            return {api};
        })
}
