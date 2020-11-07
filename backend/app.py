from flask import Flask, request
from flask_cors import CORS
from random import randrange
import time
import openfoodfacts

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello World!'

def nutri_score_to_letter():
    return

def custom_nutri(nutriments):
    if 'energy-kj_100g' in nutriments:
        energy = float(nutriments['energy-kj_100g'])
    elif 'energy-kcal_100g' in nutriments:
        energy = float(nutriments['energy-kcal_100g']*4.184)
    else:
        energy = 500
    sugar = float(nutriments['sugars_100g']) if 'sugars_100g' in nutriments else 5
    fat = float(nutriments['saturated-fat_100g']) if 'saturated-fat_100g' in nutriments else 3
    fruit = float(nutriments['fruits-vegetables-nuts_100g']) if 'fruits-vegetables-nuts_100g' in nutriments else 0
    sodium = float(nutriments['sodium_100g'])*1000 if 'sodium_100g' in nutriments else 200
    fiber = float(nutriments['fiber_100g']) if 'fiber_100g' in nutriments else 1
    proteins = float(nutriments['proteins_100g']) if 'proteins_100g' in nutriments else 2

    nutri_score = 0
    energy_threshold = [3350, 3015, 2680, 2345, 2010, 1675, 1340, 1005, 670, 335, 0]
    sugar_threshold = [45, 40, 36, 31, 27, 22.5, 18, 13.5, 9, 4.5, 0]
    fat_threshold = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    sodium_threshold = [900, 810, 720, 630, 540, 450, 360, 270, 180, 90, 0]
    fruit_threshold = [80, 80, 80, 60, 40, 0]
    fiber_threshold = [4.7, 3.7, 2.8, 1.9, 0.9, 0]
    protein_threshold = [8.0, 6.4, 4.8, 3.2, 1.6, 0]
    pos_points = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    neg_points = [5, 4, 3, 2, 1, 0]
    for threshold, point in zip(energy_threshold, pos_points):
        if energy > threshold:
            nutri_score += point
            break
    for threshold, point in zip(sugar_threshold, pos_points):
        if sugar > threshold:
            nutri_score += point
            break
    for threshold, point in zip(fat_threshold, pos_points):
        if fat > threshold:
            nutri_score += point
            break
    for threshold, point in zip(sodium_threshold, pos_points):
        if sodium > threshold:
            nutri_score += point
            break
    for threshold, point in zip(fruit_threshold, neg_points):
        if fruit > threshold:
            nutri_score -= point
            break
    for threshold, point in zip(fiber_threshold, neg_points):
        if fiber > threshold:
            nutri_score -= point
            break
    for threshold, point in zip(protein_threshold, neg_points):
        if proteins > threshold:
            nutri_score -= point
            break

    if (nutri_score < 0):
        return 'A', nutri_score
    elif (nutri_score < 3):
        return 'B', nutri_score
    elif (nutri_score < 11):
        return 'C', nutri_score
    elif (nutri_score < 19):
        return 'D', nutri_score
    else:
        return 'E', nutri_score

def score_product_on_preference(product, preferences):
    return (product['grade_people'] + 5) * preferences['people'] + \
    (product['grade_planet'] + 5) * preferences['planet'] + \
    (product['grade_price'] + 5) * preferences['price']

def rank_recommendations(recommendations):
    return sorted(recommendations, key=lambda p: p['personal_score'])


def enrich_product_scores(product, preferences):
    if 'nutrition_grades' in product and 'nutriscore_score' in product:
        product['score_people'] = product['nutrition_grades']
        product['grade_people'] = product['nutriscore_score']
    elif 'nutriments' in product and len(product['nutriments']) > 0:
        product['score_people'], product['grade_people'] = custom_nutri(product['nutriments'])
    else:
        product['score_people'] = 'N/A'
        product['grade_people'] = 40
    scores = ['A', 'B', 'C', 'D', 'E']
    price_random = randrange(5)
    product['score_price'] = scores[price_random]
    product['grade_price'] = price_random*9
    planet_random = randrange(5)
    product['score_planet'] = scores[planet_random]
    product['grade_planet'] = planet_random*9
    product['personal_score'] = score_product_on_preference(product, preferences)
    print('scores  (People, Planet, Price):', product['grade_people'], product['grade_planet'], product['grade_price'], product['personal_score'])
    return product

@app.route('/api/products/<bar_code>')
def get_product(bar_code):
    preferences = {
        'people': int(request.args.get('people', default=1)),
        'price': int(request.args.get('price', default=1)),
        'planet': int(request.args.get('planet', default=1))
    }
    product = openfoodfacts.products.get_product(bar_code)
    recommended = {}
    if product['status'] == 1:
        product = product['product']
        if 'categories_tags' in product:
            categories = product['categories_tags']
            i=1
            while len(recommended) < 2 and not i > len(categories):
                for p in openfoodfacts.products.get_by_category(product['categories_tags'][-i]):
                    if p['id'] != product['id']:
                        recommended[p['id']] = p
                i += 1

    return {
        'product': enrich_product_scores(product, preferences),
        'recommended': {
            'count': len(recommended),
            'products': rank_recommendations([enrich_product_scores(p, preferences) for p in recommended.values()])
        }
    }

@app.route('/api/products/search')
def search_product():
    key_word = request.args.get('q')
    return openfoodfacts.products.search(key_word)

if __name__ == '__main__':
    app.run()
