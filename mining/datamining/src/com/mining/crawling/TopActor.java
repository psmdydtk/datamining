package com.mining.crawling;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Repository;

@Repository
public class TopActor {

	public List<Map<String, Object>> getRank() {

		// Jsoup를 이용해서 http://www.cgv.co.kr/movies/ 크롤링
		List<Map<String, Object>> getRank = new ArrayList<>();

		String url = "https://movie.naver.com/movie/sdb/rank/rmovie.nhn"; // 크롤링할
																			// url지정
		Document doc = null; // Document에는 페이지의 전체 소스가 저장된다
		int count = 1;

		try {
			doc = Jsoup.connect(url).get();
		} catch (IOException e) {
			e.printStackTrace();
		}
		// select를 이용하여 원하는 태그를 선택한다. select는 원하는 값을 가져오기 위한 중요한 기능이다.
		Elements element = doc.select("ul.r_ranking");

		
		// Iterator을 사용하여 하나씩 값 가져오기
		Iterator<Element> ie1 = element.select("ul li a").iterator();
		ie1.next().text();ie1.next().text();ie1.next().text();ie1.next().text();ie1.next().text();
		
		while (ie1.hasNext()) {
			Map<String, Object> rank = new HashMap<>();
			if(count < 6) {
				String subs = ie1.next().text();
				subs= subs.substring(2);
				rank.put("actor",subs );
				rank.put("rank", count);
				count++;
				getRank.add(rank);	
			}
			
			else {
				String subs = ie1.next().text();
				subs= subs.substring(2);
				rank.put("actor", subs) ;
				rank.put("rank", count-5);
				count++;
				getRank.add(rank);
				if(count==11) {
					break;
				}
			}
		}
		return getRank;
	}

}