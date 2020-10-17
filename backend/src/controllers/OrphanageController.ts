import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import OrphanageView from '../views/OrphanageView';
import Orphanage from './../models/Orphanage';
import * as Yup from 'yup';

export default {

    async index (req: Request, res: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return res.status(200).json(OrphanageView.renderMany(orphanages));
    },

    async show (req: Request, res: Response) {
        const { id } = req.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOne(id, {
            relations: ['images']
        });

        if (!orphanage) {
            return res.status(404).json({error: "Orphanage not found."});
        }

        return res.status(200).json(OrphanageView.render(orphanage));
    },

    async create (req: Request, res: Response) {

        const { name, 
                latitude, 
                longitude, 
                about, 
                instructions, 
                opening_hours, 
                open_on_weekends } = req.body;

        const requestImages = req.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename };
        });
    
        const orphanagesRepository = getRepository(Orphanage);

        const data = {
            name, 
            latitude, 
            longitude, 
            about, 
            instructions, 
            opening_hours, 
            open_on_weekends: open_on_weekends === "true" ? true : false,
            images
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required(),
            })).required(),
        });

        await schema.validate(data, {
            abortEarly: false,
        });
    
        const orphanage = orphanagesRepository.create(data);
    
        await orphanagesRepository.save(orphanage);
    
        return res.status(201).json(data);
    }
};