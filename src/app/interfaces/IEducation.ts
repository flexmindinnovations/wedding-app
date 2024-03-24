export interface IEducation {
    educationId: number;
    educationName: string;
    hasSpecialization: boolean;
    specializationList: Array<ISpecialization>
}

export interface ISpecialization {
    specializationId: number;
    educationId: number;
    specializationName: string;
}