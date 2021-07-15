const Expert = require('../../Model/Expert');
const AppError = require('../../Utils/appError');
const catchAsync = require('../../Utils/catchAsync');
const adminProtect = require('../../Middlewares/adminProtect');
const authProtect = require('../../Middlewares/authProtect');
const algoliaSearch = require('algoliasearch');

const express = require('express');

const path = require('path');
const fs = require('fs');

const multer = require('multer');
const { expertIndex } = require('../../algolia');
const router = express.Router();

router.post(
  '/adminCreateExpert',
  authProtect,
  adminProtect,

  catchAsync(async (req, res, next) => {
    const expert = await Expert.create(req.body);
    const {
      salutation,
      Fname,
      LName,
      jobTitle,
      workUndertaken,
      medicoLegalSecrtaryPhone,
      medicoLegalPostcode1,
      emailMedicoLegalMatters,
      GMC,
      email,
      qualifications,
      specialInterests,
      website,
      company,
      cv,
      area,
      medicoLegalSummary,
    } = expert;
    if (req.body.approved) {
      await expertIndex.saveObject({
        objectID: expert._id,
        salutation,

        Fname,
        LName,
        jobTitle,
        workUndertaken,
        medicoLegalSecrtaryPhone,
        medicoLegalPostcode1,
        emailMedicoLegalMatters,
        GMC,
        email,
        qualifications,
        specialInterests,
        website,
        company,
        cv,
        area,
        medicoLegalSummary,
      });

      await Expert.findByIdAndUpdate(expert._id, { approved: true });
    }

    res.status(200).json({
      expert,
    });
  })
);

router.post(
  '/getFromAlgolia',

  catchAsync(async (req, res) => {
    const expert = await expertIndex.getObject(req.body.id);
    res.status(200).json({
      expert,
    });
  })
);

router.post(
  '/',
  catchAsync(async (req, res) => {
    req.body.approved = false;
    const expert = await Expert.create(req.body);
    res.status(200).json({
      expert,
    });
  })
);

router.put(
  '/deleteExpert',
  authProtect,
  adminProtect,
  catchAsync(async (req, res) => {
    const expert = await Expert.findById(req.body.id);
    console.log(expert.cv);
    if (expert.cv) {
      fs.unlink(`${__dirname}/../../public/uploads/${expert.cv}`, () => {});
    }
    await Expert.findByIdAndDelete(req.body.id);
    res.status(204).json({
      message: 'User Deleted',
    });
  })
);

router.get(
  '/getUnapproved',
  authProtect,
  adminProtect,
  catchAsync(async (req, res) => {
    let experts = await Expert.find({ approved: false });

    res.status(200).json({
      experts,
    });
  })
);

// Algolia Items
router.put(
  '/approve',
  authProtect,
  adminProtect,
  catchAsync(async (req, res) => {
    const expert = await Expert.findById(req.body.id);
    const {
      salutation,
      Fname,
      LName,
      jobTitle,
      workUndertaken,
      medicoLegalSecrtaryPhone,
      medicoLegalPostcode1,
      emailMedicoLegalMatters,
      GMC,
      email,
      qualifications,
      specialInterests,
      website,
      company,
      area,
      medicoLegalSummary,
      cv,
    } = expert;
    await expertIndex.saveObject({
      objectID: expert._id,
      salutation,
      Fname,
      LName,
      jobTitle,
      workUndertaken,
      medicoLegalSecrtaryPhone,
      medicoLegalPostcode1,
      emailMedicoLegalMatters,
      GMC,
      email,
      qualifications,
      specialInterests,
      website,
      company,
      medicoLegalSummary,
      cv,
      area,
    });
    await Expert.findByIdAndUpdate(req.body.id, { approved: true });

    res.status(200).json({
      expert,
    });
  })
);

router.put(
  '/downloadCv',
  catchAsync(async (req, res, next) => {
    console.log('request in download section');
    const expert = await Expert.findById(req.body.id);
    if (!expert.cv)
      return next(new AppError('The expert donot have a cv', 404));

    const filePath = path.resolve(
      `${__dirname}/../../public/uploads/${expert.cv}`
    );

    res.contentType('application/pdf');
    res.download(filePath, expert.cv, (err) => {
      console.log(err);
    });
  })
);

router.post(
  '/updateCv',
  authProtect,
  adminProtect,
  catchAsync(async (req, res) => {
    console.log('request came', req.headers.id);

    let fileName = '';

    const expert = await Expert.findById(req.headers.id);

    console.log(expert);
    console.log(expert.cv);

    if (!expert)
      return res.status(404).json({ message: 'No expert found with given id' });

    if (expert.cv) {
      console.log('yes');
      fs.unlink(`${__dirname}../../public/uploads/${expert.cv}`, (err) => {
        console.log(err);
      });
    }

    const storage = multer.diskStorage({
      destination: `${__dirname}/../../public/uploads`,
      filename: async function (req, file, cb) {
        fileName = req.headers.filename + path.extname(file.originalname);

        cb(null, fileName);
      },
    });

    const upload = multer({
      storage,
    }).single(req.headers.filename);

    upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        const currentExpert = await Expert.findByIdAndUpdate(req.headers.id, {
          cv: fileName,
        });

        console.log(currentExpert.approved);
        console.log(currentExpert._id);

        const {
          salutation,
          Fname,
          LName,
          jobTitle,
          workUndertaken,
          medicoLegalSecrtaryPhone,
          medicoLegalPostcode1,
          emailMedicoLegalMatters,
          GMC,
          email,
          qualifications,
          specialInterests,
          website,
          company,
          area,
          medicoLegalSummary,
        } = expert;
        // Update Cv of expert if already approved
        if (currentExpert.approved) {
          await expertIndex.saveObject({
            objectID: currentExpert._id,
            salutation,
            Fname,
            LName,
            jobTitle,
            workUndertaken,
            medicoLegalSecrtaryPhone,
            medicoLegalPostcode1,
            emailMedicoLegalMatters,
            GMC,
            email,
            qualifications,
            specialInterests,
            website,
            company,
            area,
            medicoLegalSummary,
            cv: fileName,
          });
        }

        res.status(204).send('file Uploaded Sucessfully');
      }
    });
  })
);

router.post(
  '/postCv',
  catchAsync(async (req, res) => {
    let fileName = '';

    const expert = await Expert.findById(req.headers.id);

    if (!expert)
      return res.status(404).json({ message: 'No expert found with given id' });

    if (expert.cv) {
      fs.unlink(`${__dirname}../../public/uploads/${expert.cv}`, () => {});
    }

    const storage = multer.diskStorage({
      destination: `${__dirname}/../../public/uploads`,
      filename: async function (req, file, cb) {
        fileName = req.headers.filename + path.extname(file.originalname);
        const currentExpert = await Expert.findByIdAndUpdate(req.headers.id, {
          cv: fileName,
        });

        // Update Cv of expert if already approved

        if (currentExpert.approved) {
          await expertIndex.partialUpdateObject({
            objectID: req.headers.id,
            cv: fileName,
          });
        }

        cb(null, fileName);
      },
    });

    const upload = multer({
      storage,
    }).single(req.headers.filename);

    upload(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err });
      } else {
        res.status(204).send('file Uploaded Sucessfully');
      }
    });
  })
);

router.put(
  '/updateExpert',
  authProtect,
  adminProtect,
  catchAsync(async (req, res) => {
    const expert = await expertIndex.getObject(req.headers.id);

    const {
      Fname,
      LName,
      jobTitle,
      workUndertaken,
      medicoLegalSecrtaryPhone,
      medicoLegalPostcode1,
      emailMedicoLegalMatters,
      GMC,
      email,
      qualifications,
      specialInterests,
      website,
      company,
      area,
      medicoLegalSummary,
      approved,
    } = req.body;
    let cv;

    if (expert.cv) {
      const extensions = expert.cv.split('.');
      const extension = extensions[extensions.length - 1];

      cv = `${Fname}-${medicoLegalSecrtaryPhone}.${extension}`;

      fs.rename(
        `${__dirname}/../../public/uploads/${expert.cv}`,
        `${__dirname}/../../public/uploads/${cv}`,
        (err) => {
          console.log(err);
        }
      );
    }
    if (expert.previous) {
      if (approved) {
        console.log('Previous and approved');
        await expertIndex.deleteObject(req.headers.id);
        let expert = await Expert.create({
          Fname,
          LName,
          jobTitle,
          workUndertaken,
          medicoLegalSecrtaryPhone,
          medicoLegalPostcode1,
          emailMedicoLegalMatters,
          GMC,
          email,
          qualifications,
          specialInterests,
          website,
          company,
          cv,
          area,
          medicoLegalSummary,
          previous: false,
          approved: true,
        });
        await expertIndex.saveObject({
          objectID: expert._id,

          Fname,
          LName,
          jobTitle,
          workUndertaken,
          medicoLegalSecrtaryPhone,
          medicoLegalPostcode1,
          emailMedicoLegalMatters,
          GMC,
          email,
          qualifications,
          specialInterests,
          website,
          company,
          cv,
          area,
          medicoLegalSummary,
          previous: false,
        });

        return res.status(200).json({
          id: expert._id,
        });
      } else {
        await expertIndex.deleteObject(req.headers.id);
        let expert = await Expert.create({
          ...req.body,
          cv,
        });
        return res.status(200).json({
          id: expert._id,
        });
      }
    } else {
      if (approved) {
        await expertIndex.saveObject({
          objectID: req.headers.id,

          ...req.body,
          approved: true,
          cv,
        });

        await Expert.findByIdAndUpdate(req.headers.id, {
          ...req.body,
          cv,
        });
        return res.status(200).json({
          id: req.headers.id,
        });
      } else {
        await expertIndex.deleteObject(req.headers.id);
        await Expert.findByIdAndUpdate(req.headers.id, {
          ...req.body,
          cv,
        });
        return res.status(200).json({
          id: req.headers.id,
        });
      }
    }
  })
);

module.exports = router;
