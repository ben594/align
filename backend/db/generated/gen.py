from werkzeug.security import generate_password_hash
import csv
from faker import Faker
import random
import math

num_users = 200
num_projects = 50
num_tags = 10

Faker.seed(0)
fake = Faker()

def get_csv_writer(f):
    return csv.writer(f, dialect='unix')

pid_start = 1000000
uid_start = 1000000
iid_start = 1000000

def exp_random(lam=1, power=1.5):
    value = random.expovariate(lam)  # Exponential distribution
    scaled_value = value / (value + 1)  # Scale to reduce steepness
    smoothed_value = scaled_value ** power  # Apply power transformation for smoothness
    return min(max(smoothed_value, 0), 1)  # Ensure the value is within [0, 1]

def gen_users(num_users):
    with open('Users.csv', 'w') as f:
        writer = get_csv_writer(f)
        print('Users...', end=' ', flush=True)
        for uid_offset in range(num_users):
            uid = uid_start + uid_offset
            if uid_offset % 10 == 0:
                print(f'{uid_offset}', end=' ', flush=True)
            profile = fake.profile()
            email = profile['mail']
            plain_password = f'align'
            password = generate_password_hash(plain_password)
            name_components = profile['name'].split(' ')
            firstname = name_components[0]
            lastname = name_components[-1]
            profile_url = f'https://picsum.photos/{500}/{500}?random={fake.random_int(1, 10000)}'
            balance = round(random.uniform(50, 200), 2)
            writer.writerow([uid, email, password, firstname, lastname, profile_url, balance])
        print(f'{num_users} generated')
    return 

def gen_projects(num_projects):
    project_owners = {}
    with open('Projects.csv', 'w') as f_projects, open('Roles.csv', 'w') as f_roles:
        writer_projects = get_csv_writer(f_projects)
        writer_roles = get_csv_writer(f_roles)
        print('Projects...', end=' ', flush=True)
        for pid_offset in range(num_projects):
            pid = pid_start + pid_offset
            if pid_offset % 100 == 0:
                print(f'{pid_offset}', end=' ', flush=True)
            v_uid = uid_start + int(exp_random() * (num_users - 1))
            p_name = fake.sentence(nb_words=3)[:-1]
            p_desc = fake.sentence(nb_words=15)[:-1]
            ppi  = fake.random_int(min=0, max=99) / 1000
            is_archived = random.random() < 0.2
            writer_projects.writerow([v_uid, pid, p_name, p_desc, ppi, is_archived])
            writer_roles.writerow([pid, v_uid, 'owner'])
            project_owners[pid] = v_uid
        print(f'{num_projects} generated')
    return project_owners

def gen_project_images(num_projects, project_owners, min_images=5, max_images=10):
    image_id = iid_start
    with open('Images.csv', 'w') as f, open('Roles.csv', 'a') as f_roles:
        writer = get_csv_writer(f)
        writer_roles = get_csv_writer(f_roles)
        print('Generating Project Images...', end=' ', flush=True)
        for pid_offset in range(num_projects):
            pid = pid_start + pid_offset
            if pid_offset % 100 == 0:
                print(f'{pid_offset}', end=' ', flush=True)
            num_images = fake.random_int(min_images, max_images)
            fraction_labeled = exp_random()
            fraction_accepted = random.uniform(0, 1)
            num_labeled = int(num_images * fraction_labeled)
            num_accepted = int(num_labeled * fraction_accepted)
            labeled_indices = set(random.sample(range(num_images), num_labeled))
            accepted_indices = set(random.sample(sorted(labeled_indices), num_accepted))
            labelers = []
            for idx in range(num_images):
                width = fake.random_int(800, 1200)
                height = fake.random_int(600, 900)
                img_url = f'https://picsum.photos/{width}/{height}?random={fake.random_int(1, 10000)}'
                labeled_status = idx in labeled_indices
                accepted_status = idx in accepted_indices
                labeler_uid = None 
                label_text = None
                if(labeled_status):
                    labeler_uid = uid_start + int(exp_random() * (num_users - 1))
                    label_text = fake.word()
                    if labeler_uid != project_owners[pid] and labeler_uid not in labelers:
                        labelers.append(labeler_uid)
                        writer_roles.writerow([pid, labeler_uid, 'labeler'])
                writer.writerow([image_id, img_url, pid, labeled_status, accepted_status, labeler_uid, label_text])
                image_id += 1
        print(f'{image_id - iid_start} generated')

def gen_tags(num_tags): 
    with open('Tags.csv', 'w') as f_tags, open('ProjectTags.csv', 'w') as f_proj_tags:
        writer_tags = get_csv_writer(f_tags)
        writer_proj_tags = get_csv_writer(f_proj_tags)
        tags = set()
        while len(tags) < num_tags:
            tags.add(fake.word())
        tags = list(tags)
        for tag in tags:
            writer_tags.writerow([tag])
        print('Generating Project Tags...', end=' ', flush=True)
        for pid_offset in range(num_projects):
            pid = pid_start + pid_offset
            if pid_offset % 100 == 0:
                print(f'{pid_offset}', end=' ', flush=True)
            num_project_tags = int(exp_random()*5)
            selected_tags = random.sample(tags, num_project_tags)
            for tag in selected_tags:
                writer_proj_tags.writerow([pid, tag])
        print(f'{num_tags} generated')            
            
#def merge_data_csvs():
# not implemented; need to manutally copy over every time you re-generate the data (sorry)

gen_users(num_users)
project_owners = gen_projects(num_projects)
gen_project_images(num_projects, project_owners, 10, 500)
gen_tags(num_tags)

def append_csv(source_path, target_path):
    def clean_row(row):
        return [field.replace('"', '').strip() for field in row]

    with open(source_path, 'r') as source_file, open(target_path, 'a', newline='') as target_file:
        reader = csv.reader(source_file)
        writer = csv.writer(target_file, dialect='unix')
        print(f'Appending rows from {source_path} to {target_path}...')
        for row in reader:
            writer.writerow(clean_row(row))
    print(f'Rows from {source_path} appended to {target_path}.')

append_csv('../data/Images.csv', 'Images.csv')
append_csv('../data/Payments.csv', 'Payments.csv')
append_csv('../data/Projects.csv', 'Projects.csv')
append_csv('../data/Roles.csv', 'Roles.csv')
append_csv('../data/Users.csv', 'Users.csv')


