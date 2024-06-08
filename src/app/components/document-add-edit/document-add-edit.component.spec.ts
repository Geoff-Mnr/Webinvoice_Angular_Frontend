import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DocumentAddEditComponent } from "./DocumentAddEditComponent";

describe("DocumentAddEditComponent", () => {
  let component: DocumentAddEditComponent;
  let fixture: ComponentFixture<DocumentAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentAddEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
