import { Test , TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as pactum from "pactum";
import { EmailSubscribeDto } from "src/report/dto/subscribe.dto";
import { MailTask } from '../src/mail/mail.task';
import { MailService } from '../src/mail/mail.service';


describe("e2e testing", ()=> {
  let app: INestApplication
  beforeAll(async ()=>{
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

  app = moduleRef.createNestApplication()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  await app.init()
  await app.listen(3000)
  })

  describe("reports", ()=>{
    const dto: EmailSubscribeDto = {
      email: "omondiprime@gmail.com"
    }
    describe("should test sales report", ()=>{
      it("should get sales report", ()=>{
        return pactum.spec().get("http://localhost:3000/report")
                .expectStatus(200)
                .expectHeader("content-type", "application/pdf")
                .expectHeader("content-disposition", 'inline; filename="example.pdf"')
      })
    })

    describe("should test inventory report", ()=>{
      it("should get inventory report", ()=>{
        return pactum.spec().get("http://localhost:3000/report/api/v1/inventory")
                .expectStatus(200)
                .expectHeader("content-type", "application/pdf")
                .expectHeader("content-disposition", 'inline; filename="inventory.pdf"')
      });
    });
    

    describe("should test purchases report", ()=>{
      it("should get purchases report", ()=>{
        return pactum.spec().get("http://localhost:3000/report/api/v1/purchases")
                .expectStatus(200)
                .expectHeader("content-type", "application/pdf")
                .expectHeader("content-disposition", 'inline; filename="purchases_report.pdf"')
      })
    })

    describe("It should test email", ()=>{
      it("should subscribe user email", ()=>{
        return pactum.spec().post("http://localhost:3000/report/api/v1/subscribe")
                .withBody({
                  email: dto.email
                }).expectStatus(201)
                .expectJson({ message: "Subscription successful", email: dto.email })
      })
    })

    describe("It should test email", ()=>{
      it("should return a 400 Bad request error", ()=>{
        return pactum.spec().post("http://localhost:3000/report/api/v1/subscribe")
                .withBody({
                  email: ""
                }).expectStatus(400)
                .expectJson({
                  message: [
                    "email should not be empty",
                    "email must be an email"
                  ],
                  error: "Bad Request",
                  statusCode: 400
                })
      })
    })

    

  })

  afterAll(()=> {
    app.close()
  })
})


jest.mock('../src/mail/mail.service');

describe('MailTask', () => {
  let mailTask: MailTask;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailTask, MailService],
    }).compile();

    mailTask = module.get<MailTask>(MailTask);
    mailService = module.get<MailService>(MailService);
  });

  describe('sendClientEmail', () => {
    it('should send an end-of-day report email to the specified email address', async () => {
      // Mock the sendEndOfDayReport method of MailService
      const sendEndOfDayReportMock = jest
        .spyOn(mailService, 'sendEndOfDayReport')
        .mockResolvedValue('Email sent successfully');

      // Call the sendClientEmail method
      const response = await mailTask.sendClientEmail(null);

      // Expectations
      expect(sendEndOfDayReportMock).toHaveBeenCalledWith('omondiprime@gmail.com');
      expect(response).toBe('Email sent successfully');
    });

    it('should handle errors when sending an email', async () => {
      // Mock the sendEndOfDayReport method of MailService to throw an error
      jest.spyOn(mailService, 'sendEndOfDayReport').mockRejectedValue(new Error('Email sending failed'));

      // Call the sendClientEmail method
      const response = await mailTask.sendClientEmail(null);

      // Expectations
      expect(response).toEqual(new Error('Email sending failed'));
    });
  });
});
