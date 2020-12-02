import {gql} from 'apollo-boost';

export const ADD_ADMIN = gql`
  mutation CreateAdmin($email: String!, $password: String!) {
    createAdmin(data: {email: $email, password: $password}) {
      email
    }
  }
`;

export const GET_ADMIN = gql`
  query Admin($email: String!) {
    admin(where: {email: $email}) {
      email
      name
    }
  }
`;

export const UPDATE_ADMIN = gql`
  mutation UpdateAdmin($email: String!, $password: String!, $lang: String) {
    updateAdmin(
      where: {email: $email}
      data: {email: $email, password: $password, language: $lang}
    ) {
      id
      email
    }
  }
`;

export const DELETE_ADMIN = gql`
  mutation DeleteAdmin($email: String!) {
    deleteAdmin(where: {email: $email}) {
      id
      email
    }
  }
`;

export const GET_USER = gql`
  query User($id: ID!) {
    user(where: {id: $id}) {
      id
      fullname
      rateOfWork
      owner {
        id
      }
      position {
        namePosition
        hoursOfWork {
          startWork
          endWork
        }
        secondHoursOfWork {
          startSecondWork
          endSecondWork
        }
        lunch {
          startLunch
          endLunch
        }
        secondLunch {
          startSecondLunch
          endSecondLunch
        }
        fulltime
        longOfDay
        hoursOfMonth
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query Users {
    users {
      id
      fullname
      owner {
        name
      }
      rateOfWork
      position {
        namePosition
        hoursOfWork {
          startWork
          endWork
        }
        secondHoursOfWork {
          startSecondWork
          endSecondWork
        }
        lunch {
          startLunch
          endLunch
        }
        secondLunch {
          startSecondLunch
          endSecondLunch
        }
        fulltime
        longOfDay
        hoursOfMonth
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $fullname: String
    $rateOfWork: Float
    $position: PositionUpdateDataInput
  ) {
    updateUser(
      where: {id: $id}
      data: {
        fullname: $fullname
        rateOfWork: $rateOfWork
        position: {update: $position}
      }
    ) {
      id
    }
  }
`;

export const ADD_USER = gql`
  mutation CreateUser(
    $owner: String!
    $fullname: String!
    $rateOfWork: Float!
    $namePosition: String!
    $startWork: String!
    $endWork: String!
    $startSecondWork: String!
    $endSecondWork: String!
    $startLunch: String!
    $endLunch: String!
    $startSecondLunch: String!
    $endSecondLunch: String!
    $fulltime: Boolean!
    $longOfDay: String!
    $hoursOfMonth: String
  ) {
    createUser(
      data: {
        owner: {connect: {email: $owner}}
        fullname: $fullname
        rateOfWork: $rateOfWork
        position: {
          create: {
            namePosition: $namePosition
            hoursOfWork: {create: {startWork: $startWork, endWork: $endWork}}
            secondHoursOfWork: {
              create: {
                startSecondWork: $startSecondWork
                endSecondWork: $endSecondWork
              }
            }
            lunch: {create: {startLunch: $startLunch, endLunch: $endLunch}}
            secondLunch: {
              create: {
                startSecondLunch: $startSecondLunch
                endSecondLunch: $endSecondLunch
              }
            }
            fulltime: $fulltime
            longOfDay: $longOfDay
            hoursOfMonth: $hoursOfMonth
          }
        }
      }
    ) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation UpdateAdmin($id: ID!, $email: String!) {
    updateAdmin(where: {email: $email}, data: {users: {delete: {id: $id}}}) {
      id
    }
  }
`;

export const GET_ALL_USERS_IDS = gql`
  query {
    users {
      id
      fullname
    }
  }
`;

export const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: ID!, $email: String!) {
    updateAdmin(
      where: {email: $email}
      data: {schedules: {delete: {id: $id}}}
    ) {
      id
    }
  }
`;

export const GET_SCHEDULE_AND_ALL_USERS = gql`
  query GetScheduleAndAllUsers($id: ID!) {
    schedule(where: {id: $id}) {
      id
      month {
        id
        nameOfMonth
        daysAmount
        weekdays {
          num
          isChecked
        }
        weekends {
          num
          isChecked
        }
        holidays {
          num
          isChecked
        }
        beforeHolidays {
          num
          isChecked
        }
      }
    }
    users {
      id
      fullname
      owner {
        name
      }
      rateOfWork
      position {
        namePosition
        hoursOfWork {
          startWork
          endWork
        }
        secondHoursOfWork {
          startSecondWork
          endSecondWork
        }
        lunch {
          startLunch
          endLunch
        }
        secondLunch {
          startSecondLunch
          endSecondLunch
        }
        fulltime
        longOfDay
      }
    }
  }
`;

export const GET_SCHEDULE = gql`
  query Schedule($id: ID!) {
    schedule(where: {id: $id}) {
      id
      nameSchedule
      amountOfWorkingHours
      typeOfWeek
      year
      owner {
        id
        name
      }
      theader
      month {
        id
        nameOfMonth
        daysAmount
        weekdays {
          num
          isChecked
        }
        weekends {
          num
          isChecked
        }
        holidays {
          num
          isChecked
        }
        beforeHolidays {
          num
          isChecked
        }
      }
      employees {
        id
        fullname
        rateOfWork
        hoursOfMonth
        positionOfEmployee {
          namePosition
          hoursOfWork {
            startWork
            endWork
          }
          secondHoursOfWork {
            startSecondWork
            endSecondWork
          }
          lunch {
            startLunch
            endLunch
          }
          secondLunch {
            startSecondLunch
            endSecondLunch
          }
          fulltime
          longOfDay
        }
        daysOfEmployee {
          id
          number
          weekday
          weekend
          holiday
          beforeHoliday
          firstStartWork
          firstStopWork
          secondStartWork
          secondStopWork
          kind {
            businessTrip
            study
            studyAdd
            unknown
            absenteeism
            goverment
            holiday
            disease
            vacation
            childCare
            admVacation
            overTime
            nightTime
            working
          }
        }
      }
    }
  }
`;

export const GET_ALL_SCHEDULES = gql`
  query Schedules(
    # $last: Int = 5,
    $year: Int
    $month: String!
  ) {
    schedules(
      where: {year: $year, AND: {month: {nameOfMonth: $month}}} # last: $last
    ) {
      id
      nameSchedule
      year
      month {
        id
        nameOfMonth
      }
      # employees {
      #   id
      # }
    }
  }
`;

export const ADD_SCHEDULE = gql`
  mutation CreateSchedule(
    $nameSchedule: String!
    $owner: String!
    $year: Int!
    $amountOfWorkingHours: Float
    $typeOfWeek: Float!
    $theader: String
    $nameOfMonth: String!
    $daysOfMonth: Int!
    $weekdays: [WeekdayCreateInput!]
    $weekends: [WeekendCreateInput!]
    $holidays: [HolidayCreateInput!]
    $beforeHolidays: [BeforeHolidayCreateInput!]
    $employees: [EmployeeCreateInput!]
  ) {
    createSchedule(
      data: {
        nameSchedule: $nameSchedule
        owner: {connect: {email: $owner}}
        year: $year
        amountOfWorkingHours: $amountOfWorkingHours
        typeOfWeek: $typeOfWeek
        theader: $theader
        month: {
          create: {
            nameOfMonth: $nameOfMonth
            daysAmount: $daysOfMonth
            weekdays: {create: $weekdays}
            weekends: {create: $weekends}
            holidays: {create: $holidays}
            beforeHolidays: {create: $beforeHolidays}
          }
        }
        employees: {create: $employees}
      }
    ) {
      id
    }
  }
`;

export const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule(
    $idSchedule: ID!
    $employees: [EmployeeUpdateWithWhereUniqueNestedInput!]
  ) {
    updateSchedule(
      where: {id: $idSchedule}
      data: {employees: {update: $employees}}
    ) {
      id
    }
  }
`;

export const ADD_EMPLOYEE_TO_SHEDULE = gql`
  mutation UpdateSchedule($idSchedule: ID!, $employee: [EmployeeCreateInput!]) {
    updateSchedule(
      where: {id: $idSchedule}
      data: {employees: {create: $employee}}
    ) {
      id
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($idSchedule: ID!, $idEmployee: ID!) {
    updateSchedule(
      where: {id: $idSchedule}
      data: {employees: {delete: {id: $idEmployee}}}
    ) {
      id
    }
  }
`;

export const SUB_SCHEDULES_IDS = gql`
  subscription Admin($id: ID) {
    admin(where: {node: {id: $id}, mutation_in: [CREATED, UPDATED, DELETED]}) {
      mutation
      node {
        schedules {
          id
        }
      }
    }
  }
`;
